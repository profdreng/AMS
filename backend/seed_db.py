import datetime
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

def seed():
    db = SessionLocal()
    try:
        # 1. Tool Types
        if not db.query(models.ToolType).first():
            types = [
                models.ToolType(code="MOLD_INJ", description="Molde de Injeção"),
                models.ToolType(code="MOLD_CMP", description="Molde de Compressão"),
                models.ToolType(code="CORT_EST", description="Cunho de Cortar e Estampar"),
            ]
            db.add_all(types)
            db.commit()
            print("Added Tool Types")

        # 2. Customers
        if not db.query(models.Customer).first():
            customers = [
                models.Customer(erp_customer_id="C001", name="AutoParts Inc"),
                models.Customer(erp_customer_id="C002", name="TechMold Solutions"),
            ]
            db.add_all(customers)
            db.commit()
            print("Added Customers")

        # 3. Tools
        if not db.query(models.Tool).first():
            tool_type = db.query(models.ToolType).first()
            tools = [
                models.Tool(
                    code="T-2024-001",
                    description="Molde de Injeção - Para-choques Frontal",
                    serial_number="SN-998877",
                    tool_type_id=tool_type.id,
                    manufacture_date=datetime.date(2024, 1, 15),
                    active=True
                ),
                models.Tool(
                    code="T-2024-002",
                    description="Cunho - Suporte Motor",
                    serial_number="SN-123456",
                    tool_type_id=tool_type.id,
                    manufacture_date=datetime.date(2023, 11, 20),
                    active=True
                ),
            ]
            db.add_all(tools)
            db.commit()
            print("Added Tools")

        # 4. Projects
        if not db.query(models.Project).first():
            projects = [
                models.Project(
                    code="PRJ-ALPHA",
                    description="Desenvolvimento Novo Modelo 2025",
                    start_date=datetime.date(2024, 2, 1),
                    planned_end_date=datetime.date(2024, 6, 30),
                    status="Sincronizado",
                    active=True
                ),
                models.Project(
                    code="PRJ-BETA",
                    description="Manutenção Corretiva Frota Norte",
                    start_date=datetime.date(2024, 3, 10),
                    planned_end_date=datetime.date(2024, 4, 15),
                    status="Em curso",
                    active=True
                ),
            ]
            db.add_all(projects)
            db.commit()
            print("Added Projects")

        # 5. Interventions
        if not db.query(models.Intervention).first():
            tool = db.query(models.Tool).first()
            interventions = [
                models.Intervention(
                    tool_id=tool.id,
                    location="Oficina Principal",
                    intervention_type="Preventiva",
                    priority_type="Média",
                    responsible="João Silva",
                    description="Limpeza e lubrificação trimestral",
                    status="Concluída",
                    opened_at=datetime.datetime.now() - datetime.timedelta(days=5),
                    ready_at=datetime.datetime.now() - datetime.timedelta(days=4)
                ),
                models.Intervention(
                    tool_id=tool.id,
                    location="Linha de Produção 2",
                    intervention_type="Corretiva",
                    priority_type="Alta",
                    responsible="Maria Santos",
                    description="Reparação de pino ejetor partido",
                    status="Aberta",
                    opened_at=datetime.datetime.now()
                ),
            ]
            db.add_all(interventions)
            db.commit()
            print("Added Interventions")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
