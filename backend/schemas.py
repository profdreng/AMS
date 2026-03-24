from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime

# --- Esquemas para Tipos de Ferramenta (Tool Types) ---

class ToolTypeBase(BaseModel):
    code: str
    description: Optional[str] = None

class ToolTypeCreate(ToolTypeBase):
    pass

class ToolType(ToolTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# --- Esquemas para Ferramentas (Tools) ---

class ToolBase(BaseModel):
    """Atributos base partilhados por todos os esquemas de Ferramenta."""
    tool_type_id: int
    code: str
    description: Optional[str] = None
    serial_number: Optional[str] = None
    manufacture_date: Optional[date] = None
    technical_document: Optional[str] = None
    active: bool = True

class ToolCreate(ToolBase):
    """Esquema utilizado apenas na criação de uma ferramenta (POST)."""
    pass

class Tool(ToolBase):
    """Esquema completo retornado pela API (inclui IDs e Timestamps)."""
    id: int
    created_at: datetime
    created_by: Optional[str] = None
    tool_type: Optional[ToolType] = None

    # Permite ao Pydantic ler os dados diretamente de modelos SQLAlchemy (ORM)
    model_config = ConfigDict(from_attributes=True)


# --- Esquemas para Intervenções (Interventions) ---

class InterventionBase(BaseModel):
    """Atributos base para Intervenções Técnicas."""
    tool_id: int
    location: Optional[str] = None
    intervention_type: Optional[str] = None
    priority_type: Optional[str] = None
    responsible: Optional[str] = None
    ready_at: Optional[datetime] = None
    description: Optional[str] = None
    status: Optional[str] = "Aberta"

class InterventionCreate(InterventionBase):
    """Utilizado para criar uma intervenção (POST)."""
    pass

class Intervention(InterventionBase):
    """Retornado pela API com dados de auditoria."""
    id: int
    opened_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Esquemas para Projetos (Projects) ---

class ProjectBase(BaseModel):
    """Atributos sincronizados do OpenProject."""
    code: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    planned_end_date: Optional[date] = None
    status: Optional[str] = "Planeado"

class Project(ProjectBase):
    """Projeto completo conforme guardado localmente."""
    id: int
    active: bool

    model_config = ConfigDict(from_attributes=True)
