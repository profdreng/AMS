from sqlalchemy import Column, Integer, String, Text, Boolean, Date, Numeric, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# 1. Reference Tables
class ToolType(Base):
    __tablename__ = "tool_type"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text)

class DocumentType(Base):
    __tablename__ = "document_type"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text)

class Customer(Base):
    __tablename__ = "customer"
    id = Column(Integer, primary_key=True, index=True)
    erp_customer_id = Column(String(50), unique=True)
    name = Column(String(255), nullable=False)
    active = Column(Boolean, default=True)

class InterventionResourceType(Base):
    __tablename__ = "intervention_resource_type"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text)

class ProblemType(Base):
    __tablename__ = "problem_type"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text)

# 2. Core Entities
class Tool(Base):
    __tablename__ = "tool"
    id = Column(Integer, primary_key=True, index=True)
    tool_type_id = Column(Integer, ForeignKey("tool_type.id", ondelete="RESTRICT"))
    code = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    serial_number = Column(String(100), unique=True)
    manufacture_date = Column(Date)
    technical_document = Column(String(500))  # Caminho para documento técnico
    created_at = Column(TIMESTAMP, server_default=func.now())
    created_by = Column(String(100))
    active = Column(Boolean, default=True)
    
    # Relationships
    tool_type = relationship("ToolType")
    projects = relationship("ProjectTool", back_populates="tool")
    ownership_history = relationship("ToolOwnershipHistory", back_populates="tool")
    lifecycle = relationship("ToolProductLifecycle", back_populates="tool")
    interventions = relationship("Intervention", back_populates="tool")

class Project(Base):
    __tablename__ = "project"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    planned_end_date = Column(Date)
    actual_end_date = Column(Date)
    status = Column(String(100))
    created_by = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())
    active = Column(Boolean, default=True)

    # Relationships
    tools = relationship("ProjectTool", back_populates="project")

# 3. Intersection & Detail Tables
class ProjectTool(Base):
    __tablename__ = "project_tool"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="RESTRICT"), index=True)
    tool_id = Column(Integer, ForeignKey("tool.id", ondelete="RESTRICT"), index=True)
    planned_start = Column(Date)
    planned_production_date = Column(Date)
    actual_production_date = Column(Date)
    status = Column(String(100))
    freeze_flag = Column(Boolean, default=False)
    freeze_start_date = Column(Date)
    freeze_end_date = Column(Date)
    work_hours = Column(Numeric(10, 2))
    material_cost = Column(Numeric(15, 2))
    labor_cost = Column(Numeric(15, 2))
    notes = Column(Text)
    
    __table_args__ = (UniqueConstraint('project_id', 'tool_id', name='uq_project_tool'),)

    project = relationship("Project", back_populates="tools")
    tool = relationship("Tool", back_populates="projects")
    tests = relationship("ToolTest", back_populates="project_tool")

class ToolTest(Base):
    __tablename__ = "tool_test"
    id = Column(Integer, primary_key=True, index=True)
    project_tool_id = Column(Integer, ForeignKey("project_tool.id", ondelete="RESTRICT"), index=True)
    test_number = Column(Integer)
    planned_date = Column(Date)
    actual_date = Column(Date)
    result = Column(String(100))
    notes = Column(Text)

    __table_args__ = (UniqueConstraint('project_tool_id', 'test_number', name='uq_tool_test'),)
    
    project_tool = relationship("ProjectTool", back_populates="tests")

# Technical Documents (and Junctions)
class TechnicalDocument(Base):
    __tablename__ = "technical_document"
    id = Column(Integer, primary_key=True, index=True)
    document_type_id = Column(Integer, ForeignKey("document_type.id", ondelete="RESTRICT"), index=True)
    revision_number = Column(Integer, default=1)
    status = Column(String(100))
    file_path = Column(Text)
    approved_by = Column(String(100))
    approval_date = Column(Date)
    
    document_type = relationship("DocumentType")

class TechnicalDocumentTool(Base):
    __tablename__ = "technical_document_tool"
    technical_document_id = Column(Integer, ForeignKey("technical_document.id", ondelete="RESTRICT"), primary_key=True)
    tool_id = Column(Integer, ForeignKey("tool.id", ondelete="RESTRICT"), primary_key=True, index=True)

class TechnicalDocumentProject(Base):
    __tablename__ = "technical_document_project"
    technical_document_id = Column(Integer, ForeignKey("technical_document.id", ondelete="RESTRICT"), primary_key=True)
    project_id = Column(Integer, ForeignKey("project.id", ondelete="RESTRICT"), primary_key=True, index=True)

class ToolOwnershipHistory(Base):
    __tablename__ = "tool_ownership_history"
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tool.id", ondelete="RESTRICT"), index=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="RESTRICT"), index=True)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True) # NULL means current owner
    approved_by = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())

    tool = relationship("Tool", back_populates="ownership_history")
    customer = relationship("Customer")

class ToolProductLifecycle(Base):
    __tablename__ = "tool_product_lifecycle"
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tool.id", ondelete="RESTRICT"), index=True)
    product_id = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    quantity = Column(Numeric(15, 2))

    tool = relationship("Tool", back_populates="lifecycle")

# 4. Intervention Tables
class Intervention(Base):
    __tablename__ = "intervention"
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tool.id", ondelete="RESTRICT"), index=True)
    location = Column(String(255))
    intervention_type = Column(String(100))
    priority_type = Column(String(100))
    responsible = Column(String(100))
    opened_at = Column(TIMESTAMP, server_default=func.now())
    ready_at = Column(TIMESTAMP)
    priority_order = Column(Integer)
    external = Column(String(100))
    operator_id = Column(String(100))
    technical_sheet = Column(String(255))
    description = Column(Text)
    status = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())

    tool = relationship("Tool", back_populates="interventions")
    resources = relationship("InterventionResource", back_populates="intervention")
    materials = relationship("InterventionMaterial", back_populates="intervention")
    costs = relationship("InterventionCostItem", back_populates="intervention")

class InterventionResource(Base):
    __tablename__ = "intervention_resource"
    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("intervention.id", ondelete="RESTRICT"), index=True)
    resource_type_id = Column(Integer, ForeignKey("intervention_resource_type.id", ondelete="RESTRICT"))
    hours = Column(Numeric(10, 2))
    notes = Column(Text)

    intervention = relationship("Intervention", back_populates="resources")
    resource_type = relationship("InterventionResourceType")

class InterventionMaterial(Base):
    __tablename__ = "intervention_material"
    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("intervention.id", ondelete="RESTRICT"), index=True)
    material_type = Column(String(100))
    description = Column(String(255))
    quantity = Column(Numeric(10, 2))
    unit_cost = Column(Numeric(15, 2))

    intervention = relationship("Intervention", back_populates="materials")

class InterventionCostItem(Base):
    __tablename__ = "intervention_cost_item"
    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("intervention.id", ondelete="RESTRICT"), index=True)
    cost_type = Column(String(100))
    reference_id = Column(String(100))
    quantity = Column(Numeric(10, 2))
    unit_cost = Column(Numeric(15, 2))
    total_cost = Column(Numeric(15, 2))
    
    intervention = relationship("Intervention", back_populates="costs")

class InterventionProblem(Base):
    __tablename__ = "intervention_problem"
    intervention_id = Column(Integer, ForeignKey("intervention.id", ondelete="CASCADE"), primary_key=True, index=True)
    problem_type_id = Column(Integer, ForeignKey("problem_type.id", ondelete="RESTRICT"), primary_key=True)

    intervention = relationship("Intervention")
    problem_type = relationship("ProblemType")
