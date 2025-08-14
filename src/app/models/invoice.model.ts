export interface Invoice {
  fecha?: string;
  ruc_emisor?: string;
  nombre_emisor?: string;
  numero_factura?: string;
  monto_total?: number;
  iva?: number;
  pdf_path?: string;
  email_origen?: string;
  procesado_en?: string;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  invoice_count?: number;
  invoices?: Invoice[];
}

export interface SystemStatus {
  status: string;
  excel_exists: boolean;
  last_modified?: string;
  temp_dir?: string;
  email_configured: boolean;
  openai_configured: boolean;
  job?: {
    running: boolean;
    interval_minutes: number;
    next_run?: string;
    last_run?: string;
  };
}

export interface JobStatus {
  running: boolean;
  interval_minutes: number;
  next_run?: string;
  last_run?: string;
  last_result?: ProcessResult;
}

export interface ExcelFileList {
  files: ExcelFile[];
  total_count: number;
}

export interface ExcelFile {
  filename: string;
  year_month: string;
  display_name: string;
  size: number;
  last_modified: string;
  invoice_count: number;
}

export interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  use_ssl: boolean;
  search_terms: string[];
}

export interface EmailTestResult {
  success: boolean;
  message: string;
  connection_test: boolean;
  login_test: boolean;
  search_test?: boolean;
  email_count?: number;
}
