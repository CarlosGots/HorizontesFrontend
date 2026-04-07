import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes {

  datos: any = null;
  cargando = false;
  error = '';
  reporteActual = '';

  filtro = { inicio: '', fin: '' };

  reportes = [
    { id: 'ventas', nombre: 'Ventas', icono: 'bi-graph-up', color: 'success' },
    { id: 'cancelaciones', nombre: 'Cancelaciones', icono: 'bi-x-circle', color: 'danger' },
    { id: 'ganancias', nombre: 'Ganancias Netas', icono: 'bi-currency-dollar', color: 'warning' },
    { id: 'agente-ventas', nombre: 'Agente Más Ventas', icono: 'bi-person-check', color: 'primary' },
    { id: 'agente-ganancias', nombre: 'Agente Más Ganancias', icono: 'bi-person-heart', color: 'info' },
    { id: 'paquetes-ventas', nombre: 'Paquetes por Ventas', icono: 'bi-briefcase', color: 'secondary' },
    { id: 'ocupacion-destino', nombre: 'Ocupación por Destino', icono: 'bi-geo-alt', color: 'dark' }
  ];

  constructor(private reporteService: ReporteService) {}

  generarReporte(tipo: string) {
    this.reporteActual = tipo;
    this.datos = null;
    this.cargando = true;
    this.error = '';

    const ini = this.filtro.inicio || undefined;
    const fin = this.filtro.fin || undefined;

    let obs;
    switch(tipo) {
      case 'ventas': obs = this.reporteService.getVentas(ini, fin); break;
      case 'cancelaciones': obs = this.reporteService.getCancelaciones(ini, fin); break;
      case 'ganancias': obs = this.reporteService.getGanancias(ini, fin); break;
      case 'agente-ventas': obs = this.reporteService.getAgenteVentas(ini, fin); break;
      case 'agente-ganancias': obs = this.reporteService.getAgenteGanancias(ini, fin); break;
      case 'paquetes-ventas': obs = this.reporteService.getPaquetesVentas(ini, fin); break;
      case 'ocupacion-destino': obs = this.reporteService.getOcupacionDestino(ini, fin); break;
      default: return;
    }

    obs.subscribe({
      next: (data) => { this.datos = data; this.cargando = false; },
      error: () => { this.error = 'Error al generar el reporte'; this.cargando = false; }
    });
  }

  exportarPdf() {
    if (!this.reporteActual) return;
    this.reporteService.exportarPdf(
      this.reporteActual,
      this.filtro.inicio || undefined,
      this.filtro.fin || undefined
    );
  }

  esLista(): boolean {
    return Array.isArray(this.datos);
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
}