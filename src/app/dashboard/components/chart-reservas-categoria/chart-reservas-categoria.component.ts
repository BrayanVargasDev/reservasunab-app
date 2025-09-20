import { Component, computed, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { ReservasPorCategoria } from '@shared/interfaces';

@Component({
  selector: 'app-chart-reservas-categoria',
  templateUrl: './chart-reservas-categoria.component.html',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
})
export class ChartReservasCategoriaComponent {
  data = input.required<ReservasPorCategoria[]>();

  chartOptions = computed(() => {
    // Filtrar datos válidos: categoria y cantidad deben existir y ser válidos
    const validData = this.data().filter(
      item =>
        item &&
        item.categoria &&
        item.cantidad !== undefined &&
        item.cantidad !== null,
    );

    // Si no hay datos válidos, devolver configuración mínima para evitar errores
    if (validData.length === 0) {
      return {
        series: [],
        chart: {
          type: 'pie' as any,
          height: 350,
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: false,
          },
        },
        labels: [],
        colors: [
          '#1244e3',
          '#84cb01',
          '#ffa200',
          '#ce013f',
          '#9e01e2',
          '#00a1cf',
          '#ffc408',
        ],
        legend: {
          position: 'bottom' as any,
        },
        noData: {
          text: 'No hay datos disponibles',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#6B7280',
            fontSize: '14px',
          },
        },
      };
    }

    return {
      series: validData.map(item => item.cantidad),
      chart: {
        type: 'pie' as any,
        height: 350,
      },
      labels: validData.map(item => item.categoria),
      colors: [
        '#1244e3',
        '#84cb01',
        '#ffa200',
        '#ce013f',
        '#9e01e2',
        '#00a1cf',
        '#ffc408',
      ],
      legend: {
        position: 'bottom' as any,
      },
    };
  });

  constructor() {}
}
