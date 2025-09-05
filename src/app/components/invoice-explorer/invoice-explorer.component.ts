import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface MonthlyStats {
  year_month: string;
  count: number;
  total_amount: number;
  first_date: string;
  last_date: string;
  unique_providers: number;
}

interface MonthStatistics {
  year_month: string;
  fecha_consulta: string;
  total_facturas: number;
  total_monto: number;
  total_iva: number;
  total_iva_5: number;
  total_iva_10: number;
  total_subtotal_5: number;
  total_subtotal_10: number;
  total_exentas: number;
  promedio_factura: number;
  porcentaje_cdc: number;
  porcentaje_timbrado: number;
  xml_nativo: number;
  openai_vision: number;
  total_proveedores: number;
  total_clientes: number;
  primera_factura: string;
  ultima_factura: string;
}

@Component({
  selector: 'app-invoice-explorer',
  templateUrl: './invoice-explorer.component.html',
  styleUrls: ['./invoice-explorer.component.scss']
})
export class InvoiceExplorerComponent implements OnInit {
  availableMonths: MonthlyStats[] = [];
  selectedMonth: string = '';
  monthStatistics: MonthStatistics | null = null;
  loading = false;
  error: string | null = null;
  
  // Flags para descargas en progreso
  downloadingExcel = false;
  downloadingCompleto = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAvailableMonths();
  }

  async loadAvailableMonths(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      
      const response = await this.http.get<{success: boolean, months: MonthlyStats[]}>
        (`${environment.apiUrl}/api/invoices/months`).toPromise();
      
      if (response?.success) {
        this.availableMonths = response.months;
        console.log('📅 Meses disponibles cargados:', this.availableMonths.length);
      } else {
        this.error = 'No se pudieron cargar los meses disponibles';
      }
    } catch (error) {
      console.error('Error cargando meses:', error);
      this.error = 'Error conectando con el servidor';
    } finally {
      this.loading = false;
    }
  }

  async selectMonth(yearMonth: string): Promise<void> {
    if (this.selectedMonth === yearMonth) return;
    
    this.selectedMonth = yearMonth;
    this.monthStatistics = null;
    
    if (!yearMonth) return;
    
    try {
      this.loading = true;
      this.error = null;
      
      const response = await this.http.get<{success: boolean, statistics: MonthStatistics}>
        (`${environment.apiUrl}/api/invoices/month/${yearMonth}/stats`).toPromise();
      
      if (response?.success) {
        this.monthStatistics = response.statistics;
        console.log('📊 Estadísticas del mes cargadas:', this.monthStatistics);
      } else {
        this.error = 'No se pudieron cargar las estadísticas del mes';
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      this.error = 'Error obteniendo estadísticas del mes';
    } finally {
      this.loading = false;
    }
  }

  async downloadExcelASCONT(yearMonth: string): Promise<void> {
    if (!yearMonth || this.downloadingExcel) return;
    
    try {
      this.downloadingExcel = true;
      console.log('📥 Descargando Excel ASCONT para:', yearMonth);
      
      const url = `${environment.apiUrl}/api/export/excel-from-mongodb/${yearMonth}?export_type=ascont`;
      
      // Crear enlace temporal para descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `facturas_ascont_${yearMonth}.xlsx`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Descarga Excel ASCONT iniciada');
      
    } catch (error) {
      console.error('Error descargando Excel ASCONT:', error);
      this.error = 'Error descargando archivo Excel ASCONT';
    } finally {
      this.downloadingExcel = false;
    }
  }

  async downloadExcelCompleto(yearMonth: string): Promise<void> {
    if (!yearMonth || this.downloadingCompleto) return;
    
    try {
      this.downloadingCompleto = true;
      console.log('📥 Descargando Excel Completo para:', yearMonth);
      
      const url = `${environment.apiUrl}/api/export/excel-from-mongodb/${yearMonth}?export_type=completo`;
      
      // Crear enlace temporal para descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `facturas_completas_${yearMonth}.xlsx`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Descarga Excel Completo iniciada');
      
    } catch (error) {
      console.error('Error descargando Excel Completo:', error);
      this.error = 'Error descargando archivo Excel Completo';
    } finally {
      this.downloadingCompleto = false;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  getQualityColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  refreshData(): void {
    this.loadAvailableMonths();
    if (this.selectedMonth) {
      this.selectMonth(this.selectedMonth);
    }
  }

  clearSelection(): void {
    this.selectedMonth = '';
    this.monthStatistics = null;
    this.error = null;
  }

  trackByMonth(index: number, month: MonthlyStats): string {
    return month.year_month;
  }

  formatMonthName(yearMonth: string): string {
    if (!yearMonth) return '';
    
    try {
      const [year, month] = yearMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      return date.toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return yearMonth;
    }
  }
}