import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ExcelFileList, ExcelFile } from '../../models/invoice.model';

@Component({
  selector: 'app-excel-manager',
  templateUrl: './excel-manager.component.html',
  styleUrls: ['./excel-manager.component.scss']
})
export class ExcelManagerComponent implements OnInit {
  excelFiles: ExcelFile[] = [];
  loading = false;
  error: string | null = null;
  totalFiles = 0;
  downloading: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadExcelFiles();
  }

  loadExcelFiles(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getExcelFiles().subscribe({
      next: (data: ExcelFileList) => {
        this.excelFiles = data.files.sort((a, b) => b.year_month.localeCompare(a.year_month));
        this.totalFiles = data.total_count;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la lista de archivos Excel';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadExcel(file: ExcelFile): void {
    this.downloading = file.year_month;
    
    // Simulate download delay for better UX
    setTimeout(() => {
      window.location.href = this.apiService.getExcelFileUrl(file.year_month);
      this.downloading = null;
    }, 500);
  }

  previewFile(file: ExcelFile): void {
    // Future implementation for file preview
    console.log('Preview file:', file.filename);
    // Could implement a modal or new tab with file preview
  }

  trackByFn(index: number, item: ExcelFile): string {
    return item.year_month;
  }

  getTotalInvoices(): number {
    return this.excelFiles.reduce((total, file) => total + file.invoice_count, 0);
  }

  getTotalSize(): string {
    const totalBytes = this.excelFiles.reduce((total, file) => total + file.size, 0);
    return this.formatFileSize(totalBytes);
  }

  getMonthRange(): string {
    if (this.excelFiles.length === 0) return '0';
    if (this.excelFiles.length === 1) return '1 mes';
    
    const sortedFiles = [...this.excelFiles].sort((a, b) => a.year_month.localeCompare(b.year_month));
    const firstMonth = this.formatYearMonthShort(sortedFiles[0].year_month);
    const lastMonth = this.formatYearMonthShort(sortedFiles[sortedFiles.length - 1].year_month);
    
    return `${firstMonth} - ${lastMonth}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  private formatYearMonthShort(yearMonth: string): string {
    if (yearMonth.length !== 6) return yearMonth;
    
    const year = yearMonth.substring(2, 4); // Solo últimos 2 dígitos del año
    const month = yearMonth.substring(4, 6);
    
    return `${month}/${year}`;
  }
}
