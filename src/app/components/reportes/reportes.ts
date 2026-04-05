import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  datos: any[] = [];
  cargando = false;
  error = '';
  reporteActual = '';

  filtro = {
    inicio: '',
    fin: ''
  };

  reportes = [
    { id: 'ventas', nombre: 'Reporte de Ventas', icono: 'bi-graph-up', color: 'success' },
    { id: 'cancelaciones', nombre: 'Reporte de Cancelaciones', icono: 'bi-x-circle', color: 'danger' }
  ];

  constructor(private reporteService: ReporteService) {}

  ngOnInit() {}

  generarReporte(tipo: string) {
    this.reporteActual = tipo;
    this.datos = [];
    this.cargando = true;
    this.error = '';

    const obs = tipo === 'ventas'
      ? this.reporteService.getVentas(this.filtro.inicio, this.filtro.fin)
      : this.reporteService.getCancelaciones(this.filtro.inicio, this.filtro.fin);

    obs.subscribe({
      next: (data) => {
        this.datos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al generar el reporte';
        this.cargando = false;
      }
    });
  }

  exportarPdf() {
    if (!this.reporteActual) return;
    this.reporteService.exportarPdf(
      this.reporteActual,
      this.filtro.inicio,
      this.filtro.fin
    );
  }

  getColorEstado(estado: string): string {
    switch(estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'danger';
      case 'COMPLETADA': return 'info';
      default: return 'secondary';
    }
  }

  getTotalVentas(): number {
    return this.datos.reduce((sum, r) => sum + (r.costoTotal || 0), 0);
  }

  getTotalReembolsos(): number {
    return this.datos.reduce((sum, r) => sum + (r.montoReembolso || 0), 0);
  }
}