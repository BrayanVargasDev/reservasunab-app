import { Component, computed, input } from '@angular/core';
import { NgApexchartsModule, ApexOptions, ChartType } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { PromedioPorHoras } from '@shared/interfaces';

@Component({
  selector: 'app-chart-promedio-horas',
  templateUrl: './chart-promedio-horas.component.html',
  // styleUrls: ['./chart-promedio-horas.component.css'],
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
})
export class ChartPromedioHorasComponent {
  data = input.required<PromedioPorHoras[]>();

  chartOptions = computed(() => {
    const rows = this.data();
    return {
      series: [
        {
          name: 'Promedio',
          data: rows.map(item => item.promedio),
        },
      ],
      chart: {
        type: 'bar' as ChartType,
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: '#000', // fuerza color de texto global
      },
      // Etiquetas de datos en negro
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000'], // básico
        },
        background: {
          enabled: true,
          foreColor: '#000', // prioridad sobre style.colors
          opacity: 0, // fondo invisible, mantiene foreColor
          borderRadius: 2,
        },
        offsetY: -4,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          dataLabels: {
            position: 'top',
          },
        },
      },
      yaxis: {
        title: { text: 'Promedio de Reservas' },
      },
      xaxis: {
        categories: rows.map(item => item.hora),
        title: { text: 'Hora del día' },
        labels: {
          formatter: (val: string) => {
            if (val && typeof val === 'string') {
              return val.replace(':00', '');
            }
            return val ? val : '';
          },
        },
      },
      colors: ['#ffa200', '#314157'],
      grid: { show: true },
    };
  });
}
