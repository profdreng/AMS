-- ==============================================================================
-- PostgreSQL Implementation for Tool & Project Management (Revised)
-- ==============================================================================

-- 1. Reference Tables (No foreign keys)
CREATE TABLE tool_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE document_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    erp_customer_id VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE intervention_resource_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE problem_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 2. Core Entities
CREATE TABLE tool (
    id SERIAL PRIMARY KEY,
    tool_type_id INTEGER REFERENCES tool_type(id) ON DELETE RESTRICT,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    serial_number VARCHAR(100) UNIQUE,
    manufacture_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    status VARCHAR(100),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- 3. Intersection & Detail Tables
CREATE TABLE project_tool (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES project(id) ON DELETE RESTRICT,
    tool_id INTEGER REFERENCES tool(id) ON DELETE RESTRICT,
    planned_start DATE,
    planned_production_date DATE,
    actual_production_date DATE,
    status VARCHAR(100),
    freeze_flag BOOLEAN DEFAULT FALSE,
    freeze_start_date DATE,
    freeze_end_date DATE,
    work_hours NUMERIC(10, 2),
    material_cost NUMERIC(15, 2),
    labor_cost NUMERIC(15, 2),
    notes TEXT,
    UNIQUE (project_id, tool_id)  -- A tool can only appear once per project
);

CREATE TABLE tool_test (
    id SERIAL PRIMARY KEY,
    project_tool_id INTEGER REFERENCES project_tool(id) ON DELETE RESTRICT,
    test_number INTEGER,
    planned_date DATE,
    actual_date DATE,
    result VARCHAR(100),
    notes TEXT,
    UNIQUE (project_tool_id, test_number)  -- Test numbers are unique within a project_tool
);

-- technical_document holds only document-level data.
-- Associations to tools and projects are handled via junction tables below.
CREATE TABLE technical_document (
    id SERIAL PRIMARY KEY,
    document_type_id INTEGER REFERENCES document_type(id) ON DELETE RESTRICT,
    revision_number INTEGER DEFAULT 1,
    status VARCHAR(100),
    file_path TEXT,
    approved_by VARCHAR(100),
    approval_date DATE
);

-- Junction: a document can be associated with many tools
CREATE TABLE technical_document_tool (
    technical_document_id INTEGER REFERENCES technical_document(id) ON DELETE RESTRICT,
    tool_id INTEGER REFERENCES tool(id) ON DELETE RESTRICT,
    PRIMARY KEY (technical_document_id, tool_id)
);

-- Junction: a document can be associated with many projects
CREATE TABLE technical_document_project (
    technical_document_id INTEGER REFERENCES technical_document(id) ON DELETE RESTRICT,
    project_id INTEGER REFERENCES project(id) ON DELETE RESTRICT,
    PRIMARY KEY (technical_document_id, project_id)
);

CREATE TABLE tool_ownership_history (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tool(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customer(id) ON DELETE RESTRICT,
    start_date DATE,
    end_date DATE,  -- NULL means current owner
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensures only one open (current) ownership record exists per tool at a time
CREATE UNIQUE INDEX uix_tool_ownership_current
    ON tool_ownership_history (tool_id)
    WHERE end_date IS NULL;

CREATE TABLE tool_product_lifecycle (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tool(id) ON DELETE RESTRICT,
    product_id VARCHAR(100),  -- Product defined outside this system / ERP
    start_date DATE,
    end_date DATE,
    quantity NUMERIC(15, 2)
);

-- 4. Intervention Tables
CREATE TABLE intervention (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tool(id) ON DELETE RESTRICT,
    location VARCHAR(255),
    intervention_type VARCHAR(100),
    priority_type VARCHAR(100),
    responsible VARCHAR(100),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ready_at TIMESTAMP,
    priority_order INTEGER,
    external VARCHAR(100),
    operator_id VARCHAR(100),
    technical_sheet VARCHAR(255),
    description TEXT,
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE intervention_resource (
    id SERIAL PRIMARY KEY,
    intervention_id INTEGER REFERENCES intervention(id) ON DELETE RESTRICT,
    resource_type_id INTEGER REFERENCES intervention_resource_type(id) ON DELETE RESTRICT,
    hours NUMERIC(10, 2),
    notes TEXT
);

CREATE TABLE intervention_material (
    id SERIAL PRIMARY KEY,
    intervention_id INTEGER REFERENCES intervention(id) ON DELETE RESTRICT,
    material_type VARCHAR(100),
    description VARCHAR(255),
    quantity NUMERIC(10, 2),
    unit_cost NUMERIC(15, 2)
);

CREATE TABLE intervention_cost_item (
    id SERIAL PRIMARY KEY,
    intervention_id INTEGER REFERENCES intervention(id) ON DELETE RESTRICT,
    cost_type VARCHAR(100),   -- E.g., 'Subcontractor', 'Freight', etc.
    reference_id VARCHAR(100),
    quantity NUMERIC(10, 2),
    unit_cost NUMERIC(15, 2),
    total_cost NUMERIC(15, 2) -- May be a flat charge not derivable from qty * unit_cost
);

CREATE TABLE intervention_problem (
    intervention_id INTEGER REFERENCES intervention(id) ON DELETE CASCADE,
    problem_type_id INTEGER REFERENCES problem_type(id) ON DELETE RESTRICT,
    PRIMARY KEY (intervention_id, problem_type_id)
);

-- ==============================================================================
-- Indexes
-- ==============================================================================

CREATE INDEX idx_tool_tool_type         ON tool(tool_type_id);
CREATE INDEX idx_project_tool_project   ON project_tool(project_id);
CREATE INDEX idx_project_tool_tool      ON project_tool(tool_id);
CREATE INDEX idx_tool_test_project_tool ON tool_test(project_tool_id);
CREATE INDEX idx_tech_doc_type          ON technical_document(document_type_id);
CREATE INDEX idx_tech_doc_tool          ON technical_document_tool(tool_id);
CREATE INDEX idx_tech_doc_project       ON technical_document_project(project_id);
CREATE INDEX idx_ownership_tool         ON tool_ownership_history(tool_id);
CREATE INDEX idx_ownership_customer     ON tool_ownership_history(customer_id);
CREATE INDEX idx_lifecycle_tool         ON tool_product_lifecycle(tool_id);
CREATE INDEX idx_intervention_tool      ON intervention(tool_id);
CREATE INDEX idx_int_resource_int       ON intervention_resource(intervention_id);
CREATE INDEX idx_int_material_int       ON intervention_material(intervention_id);
CREATE INDEX idx_int_cost_int           ON intervention_cost_item(intervention_id);
CREATE INDEX idx_int_problem_int        ON intervention_problem(intervention_id);
