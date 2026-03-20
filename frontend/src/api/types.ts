export interface Tool {
  id: number;
  tool_type_id: number;
  code: string;
  description?: string;
  serial_number?: string;
  manufacture_date?: string;
  active: boolean;
  created_at: string;
}

export interface Intervention {
  id: number;
  tool_id: number;
  location?: string;
  intervention_type?: string;
  priority_type?: string;
  responsible?: string;
  ready_at?: string;
  description?: string;
  status?: string;
  opened_at: string;
  created_at: string;
}

export interface Project {
  id: number;
  code: string;
  description?: string;
  start_date?: string;
  planned_end_date?: string;
  status?: string;
  active: boolean;
}
