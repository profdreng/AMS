from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importamos a engine de base de dados e os modelos ORM/Schemas
from .database import engine, get_db
from . import models, schemas

# Criação automática das tabelas definidas nos models (apenas para desenvolvimento)
# Em produção deverá ser utilizado o Alembic para migrações controladas.
models.Base.metadata.create_all(bind=engine)

# Inicialização da APP FastAPI
app = FastAPI(
    title="APMS Backend API",
    description="Sistema de Gestão de Ativos e Projetos integrado com Sage X3 e OpenProject",
    version="1.0.0"
)

# Configuração de CORS (Cross-Origin Resource Sharing)
# Permite que o Frontend (Streamlit) faça pedidos a este Backend se estiverem em domínios/portas diferentes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, deverá ser restrito ao URL específico do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Endpoint básico para validar se a API está online."""
    return {"message": "Bem-vindo à API do APMS"}

# --- Endpoints para Tipos de Ferramenta (Tool Types) ---

@app.get("/tool-types/", response_model=List[schemas.ToolType])
def read_tool_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lista todos os tipos de ferramenta (Molde, Cunho, etc)."""
    return db.query(models.ToolType).offset(skip).limit(limit).all()


# --- Endpoints para Ferramentas (Tools) ---

@app.get("/tools/", response_model=List[schemas.Tool])
def read_tools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lista todas as ferramentas registadas na base de dados."""
    tools = db.query(models.Tool).offset(skip).limit(limit).all()
    return tools

@app.post("/tools/", response_model=schemas.Tool)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(get_db)):
    """Cria um novo registo de ferramenta."""
    # O Pydantic valida os dados de entrada contra o esquema ToolCreate
    db_tool = models.Tool(**tool.model_dump())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

@app.get("/tools/{tool_id}", response_model=schemas.Tool)
def read_tool(tool_id: int, db: Session = Depends(get_db)):
    """Obtém os detalhes de uma ferramenta específica."""
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
    return tool

@app.put("/tools/{tool_id}", response_model=schemas.Tool)
def update_tool(tool_id: int, tool: schemas.ToolCreate, db: Session = Depends(get_db)):
    """Atualiza os dados de uma ferramenta existente."""
    db_tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not db_tool:
        raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
    
    # Atualiza os campos
    for key, value in tool.model_dump().items():
        setattr(db_tool, key, value)
    
    db.commit()
    db.refresh(db_tool)
    return db_tool

@app.delete("/tools/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    """Elimina uma ferramenta se não existir ligações."""
    db_tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not db_tool:
        raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
    
    # Verifica se existem intervenções associadas
    intervention_count = db.query(models.Intervention).filter(
        models.Intervention.tool_id == tool_id
    ).count()
    
    if intervention_count > 0:
        raise HTTPException(status_code=409, detail=f"Não é possível eliminar. Existem {intervention_count} intervenção(ões) associada(s).")
    
    # Se não houver ligações, elimina
    db.delete(db_tool)
    db.commit()
    return {"status": "success", "message": "Ferramenta eliminada com sucesso"}

@app.post("/tools/{tool_id}/documents/")
def add_tool_document(tool_id: int, file_path: str, db: Session = Depends(get_db)):
    """Associa um caminho de ficheiro documental a uma ferramenta."""
    # 1. Criar o documento técnico (simplificado)
    db_doc = models.TechnicalDocument(file_path=file_path, status="Ativo")
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    # 2. Criar a associação na tabela de junção
    assoc = models.TechnicalDocumentTool(technical_document_id=db_doc.id, tool_id=tool_id)
    db.add(assoc)
    db.commit()
    return {"status": "success", "document_id": db_doc.id}

# --- Endpoints para Intervenções (Interventions) ---

@app.get("/interventions/", response_model=List[schemas.Intervention])
def read_interventions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lista todas as intervenções técnicas em curso ou concluídas."""
    interventions = db.query(models.Intervention).offset(skip).limit(limit).all()
    return interventions

@app.post("/interventions/", response_model=schemas.Intervention)
def create_intervention(intervention: schemas.InterventionCreate, db: Session = Depends(get_db)):
    """Regista uma nova intervenção e associa-a a uma ferramenta."""
    db_interv = models.Intervention(**intervention.model_dump())
    db.add(db_interv)
    db.commit()
    db.refresh(db_interv)
    return db_interv

# --- Endpoints de Sincronização (Sync) ---
from . import sync

@app.post("/sync/projects/")
def sync_projects(db: Session = Depends(get_db)):
    """Despoleta a importação de projetos do OpenProject para o APMS."""
    count = sync.sync_projects_from_openproject(db)
    return {"status": "success", "synced_projects": count}

@app.post("/sync/intervention/{intervention_id}")
def sync_intervention(intervention_id: int, db: Session = Depends(get_db)):
    """Ouvinte de evento: Sincroniza uma nova intervenção com o OpenProject/QMS."""
    success = sync.sync_intervention_to_external(db, intervention_id)
    if not success:
         raise HTTPException(status_code=404, detail="Intervenção não encontrada para sincronização")
    return {"status": "success", "intervention_id": intervention_id}

@app.get("/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lista os projetos que já foram sincronizados para a base de dados local."""
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects
