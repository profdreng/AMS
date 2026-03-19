from sqlalchemy.orm import Session
from . import models
from .services.openproject import OpenProjectClient
from .services.sagex3 import SageX3Client
from .services.qms import QMSClient

# Inicialização dos clientes para serviços externos
op_client = OpenProjectClient()
sage_client = SageX3Client()
qms_client = QMSClient()

def sync_projects_from_openproject(db: Session):
    """
    Importa projetos do OpenProject para a base de dados local do APMS.
    Evita duplicados verificando o código do projeto.
    """
    op_projects = op_client.get_projects()
    synced_count = 0
    
    for op_prj in op_projects:
        # Usamos o 'identifier' ou o ID do OpenProject como código único
        code = op_prj.get("identifier") or f"OP-{op_prj['id']}"
        db_prj = db.query(models.Project).filter(models.Project.code == code).first()
        
        # Só inserimos se o projeto ainda não existir localmente
        if not db_prj:
            db_prj = models.Project(
                code=code,
                description=op_prj.get("description", {}).get("raw", ""),
                status="Sincronizado",
                active=True
            )
            db.add(db_prj)
            synced_count += 1
            
    db.commit()
    return synced_count

def sync_intervention_to_external(db: Session, intervention_id: int):
    """
    Orquestrador de Eventos: Quando uma intervenção é criada no APMS, 
    é necessário notificar sistemas externos.
    """
    interv = db.query(models.Intervention).filter(models.Intervention.id == intervention_id).first()
    if not interv:
        return False
    
    # 1. Notificar OpenProject: Cria um 'Work Package' (Tarefa) no projeto associado.
    # Isto permite que a equipa de planeamento acompanhe a manutenção no sistema central.
    tool = interv.tool
    subject = f"Intervenção {interv.intervention_type}: {tool.code}"
    description = f"Intervenção registada no APMS.\nResponsável: {interv.responsible}\nLocal: {interv.location}"
    
    # Por agora, usamos o Project ID 1 como alvo por defeito (configurável no futuro)
    op_client.create_work_package(project_id=1, subject=subject, description=description)
    
    # 2. Notificar QMS: Se for uma calibração, o sistema de qualidade precisa de um alerta.
    if interv.intervention_type == "Calibração":
        qms_client.notify_test_required(tool.serial_number, "Calibração")
        
    return True

def sync_material_to_sage(db: Session, intervention_id: int, material_code: str, qty: float):
    """
    Sincroniza consumos de material com o Sage X3 para atualização de stock.
    """
    success = sage_client.log_material_consumption(intervention_id, material_code, qty)
    return success
