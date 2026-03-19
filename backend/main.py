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
