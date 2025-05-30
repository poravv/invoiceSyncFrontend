import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SystemStatus, ProcessResult, JobStatus } from '../models/invoice.model';


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

  // Obtener la URL del archivo Excel
  getExcelUrl(): string {
    return `${this.apiUrl}/excel`;
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
}
