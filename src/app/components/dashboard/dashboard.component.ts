import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProcessResult, SystemStatus, JobStatus, ExcelFileList, TaskSubmitResponse, TaskStatusResponse } from '../../models/invoice.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  status: SystemStatus | null = null;
  jobStatus: JobStatus | null = null;
  excelFiles: ExcelFileList | null = null;
  loading = false;
  jobLoading = false;
  excelLoading = false;
  processingResult: ProcessResult | null = null;
  processingJobId: string | null = null;
  processingPolling: Subscription | null = null;
  error: string | null = null;
  jobError: string | null = null;
  excelError: string | null = null;
  
  // Para actualización automática
  autoRefresh: boolean = false;
  refreshSubscription: Subscription | null = null;
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getSystemStatus();
    this.getJobStatus();
    this.loadExcelFiles();
  }
  
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  getSystemStatus(): void {
    this.loading = true;
    this.apiService.getStatus().subscribe({
      next: (data) => {
        this.status = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener estado del sistema';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  getJobStatus(): void {
    this.jobLoading = true;
    this.apiService.getJobStatus().subscribe({
      next: (data) => {
        this.jobStatus = data;
        this.jobLoading = false;
      },
      error: (err) => {
        this.jobError = 'Error al obtener estado del job';
        this.jobLoading = false;
        console.error(err);
      }
    });
  }

  loadExcelFiles(): void {
    this.excelLoading = true;
    this.excelError = null;
    
    this.apiService.getExcelFiles().subscribe({
      next: (data) => {
        this.excelFiles = data;
        this.excelLoading = false;
      },
      error: (err) => {
        this.excelError = 'Error al cargar archivos Excel';
        this.excelLoading = false;
        console.error(err);
      }
    });
  }

  processEmails(async: boolean = true): void {
    // Encolar proceso para evitar interferencia y obtener job_id
    this.loading = true;
    this.processingResult = null;
    this.processingJobId = null;

    this.apiService.enqueueProcess().subscribe({
      next: (res: TaskSubmitResponse) => {
        this.processingJobId = res.job_id;
        // Polling hasta finalizar
        this.processingPolling = interval(2000).subscribe(() => this.pollJob());
      },
      error: (err) => {
        this.error = 'No se pudo encolar el procesamiento';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private pollJob(): void {
    if (!this.processingJobId) return;
    this.apiService.getTaskStatus(this.processingJobId).subscribe({
      next: (st: TaskStatusResponse) => {
        if (st.status === 'done' || st.status === 'error') {
          if (this.processingPolling) {
            this.processingPolling.unsubscribe();
            this.processingPolling = null;
          }
          this.loading = false;
          this.processingResult = st.result || null;
          // refrescar estado
          this.getSystemStatus();
          this.getJobStatus();
          this.loadExcelFiles();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  startJob(): void {
    this.jobLoading = true;
    
    this.apiService.startJob().subscribe({
      next: (result) => {
        this.jobStatus = result;
        this.jobLoading = false;
        this.startAutoRefresh();
      },
      error: (err) => {
        this.jobError = 'Error al iniciar el job programado';
        this.jobLoading = false;
        console.error(err);
      }
    });
  }
  
  stopJob(): void {
    this.jobLoading = true;
    
    this.apiService.stopJob().subscribe({
      next: (result) => {
        this.jobStatus = result;
        this.jobLoading = false;
        this.stopAutoRefresh();
      },
      error: (err) => {
        this.jobError = 'Error al detener el job programado';
        this.jobLoading = false;
        console.error(err);
      }
    });
  }
  
  startAutoRefresh(): void {
    this.autoRefresh = true;
    
    // Detener si ya hay una suscripción activa
    this.stopAutoRefresh();
    
    // Actualizar cada 30 segundos
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.getSystemStatus();
      this.getJobStatus();
    });
  }
  
  stopAutoRefresh(): void {
    this.autoRefresh = false;
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  onAutoRefreshChange(event: Event): void {
    // Cast event.target to HTMLInputElement para acceder a la propiedad checked
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  downloadExcel(): void {
    window.location.href = this.apiService.getExcelUrl();
  }

  downloadExcelFile(yearMonth: string): void {
    window.location.href = this.apiService.getExcelFileUrl(yearMonth);
  }

  formatYearMonth(yearMonth: string): string {
    if (yearMonth.length !== 6) return yearMonth;
    
    const year = yearMonth.substring(0, 4);
    const month = yearMonth.substring(4, 6);
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }
}
