import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SystemStatus, ProcessResult, JobStatus, ExcelFileList, EmailConfig, EmailTestResult, TaskSubmitResponse, TaskStatusResponse, AutoRefreshPref } from '../models/invoice.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener estado del sistema
  getStatus(): Observable<SystemStatus> {
    return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
  }

  // Procesar correos
  processEmails(runAsync: boolean = false): Observable<ProcessResult> {
    return this.http.post<ProcessResult>(`${this.apiUrl}/process`, { run_async: runAsync });
  }

  // Subir un archivo PDF
  uploadPdf(file: File, metadata: {sender?: string, date?: string}): Observable<ProcessResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata.sender) {
      formData.append('sender', metadata.sender);
    }
    
    if (metadata.date) {
      formData.append('date', metadata.date);
    }
    
    return this.http.post<ProcessResult>(`${this.apiUrl}/upload`, formData);
  }

  // Subir un archivo XML
  uploadXml(file: File, metadata: {sender?: string, date?: string}): Observable<ProcessResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata.sender) {
      formData.append('sender', metadata.sender);
    }

    if (metadata.date) {
      formData.append('date', metadata.date);
    }

    return this.http.post<ProcessResult>(`${this.apiUrl}/upload-xml`, formData);
  }

  // Encolar carga de PDF
  enqueueUploadPdf(file: File, metadata: {sender?: string, date?: string}): Observable<TaskSubmitResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.sender) formData.append('sender', metadata.sender);
    if (metadata.date) formData.append('date', metadata.date);
    return this.http.post<TaskSubmitResponse>(`${this.apiUrl}/tasks/upload-pdf`, formData);
  }

  // Encolar carga de XML
  enqueueUploadXml(file: File, metadata: {sender?: string, date?: string}): Observable<TaskSubmitResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.sender) formData.append('sender', metadata.sender);
    if (metadata.date) formData.append('date', metadata.date);
    return this.http.post<TaskSubmitResponse>(`${this.apiUrl}/tasks/upload-xml`, formData);
  }

  // Obtener la URL del archivo Excel (depreciado - mantener para compatibilidad)
  getExcelUrl(): string {
    const timestamp = new Date().getTime();
    return `${this.apiUrl}/excel?t=${timestamp}`;
  }

  // Obtener lista de archivos Excel mensuales
  getExcelFiles(): Observable<ExcelFileList> {
    return this.http.get<ExcelFileList>(`${this.apiUrl}/excel/list`);
  }

  // Descargar archivo Excel específico por año-mes
  getExcelFileUrl(yearMonth: string): string {
    const timestamp = new Date().getTime();
    return `${this.apiUrl}/excel/${yearMonth}?t=${timestamp}`;
  }

  // Probar configuración de email
  testEmailConfig(config: EmailConfig): Observable<EmailTestResult> {
    return this.http.post<EmailTestResult>(`${this.apiUrl}/email-config/test`, config);
  }
  
  // Iniciar job programado
  startJob(): Observable<JobStatus> {
    return this.http.post<JobStatus>(`${this.apiUrl}/job/start`, {});
  }
  
  // Detener job programado
  stopJob(): Observable<JobStatus> {
    return this.http.post<JobStatus>(`${this.apiUrl}/job/stop`, {});
  }
  
  // Obtener estado del job
  getJobStatus(): Observable<JobStatus> {
    return this.http.get<JobStatus>(`${this.apiUrl}/job/status`);
  }

  // Ajustar intervalo del job (minutos)
  setJobInterval(minutes: number): Observable<JobStatus> {
    return this.http.post<JobStatus>(`${this.apiUrl}/job/interval`, { minutes });
  }

  // Procesamiento directo sin cola de tareas
  processEmailsDirect(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process-direct`, {});
  }

  // Encolar procesamiento (usa TaskQueue)
  enqueueProcess(): Observable<TaskSubmitResponse> {
    return this.http.post<TaskSubmitResponse>(`${this.apiUrl}/tasks/process`, {});
  }

  // Consultar estado de tarea
  getTaskStatus(jobId: string): Observable<TaskStatusResponse> {
    return this.http.get<TaskStatusResponse>(`${this.apiUrl}/tasks/${jobId}`);
  }

  // Limpiar tareas antiguas
  cleanupOldTasks(): Observable<{message: string, cleaned_count: number}> {
    return this.http.delete<{message: string, cleaned_count: number}>(`${this.apiUrl}/tasks/cleanup`);
  }

  // Debug de tareas (solo para desarrollo)
  debugTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tasks/debug`);
  }

  // Preferencias: Auto‑refresh
  getAutoRefreshPref(): Observable<AutoRefreshPref> {
    return this.http.get<AutoRefreshPref>(`${this.apiUrl}/prefs/auto-refresh`);
  }

  setAutoRefreshPref(enabled: boolean, interval_ms: number): Observable<AutoRefreshPref> {
    return this.http.post<AutoRefreshPref>(`${this.apiUrl}/prefs/auto-refresh`, { enabled, interval_ms });
  }
}
