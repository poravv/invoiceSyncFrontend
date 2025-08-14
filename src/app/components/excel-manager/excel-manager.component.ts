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
    window.location.href = this.apiService.getExcelFileUrl(file.year_month);
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
}
