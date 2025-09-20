import { Component, computed, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { PromedioPorHoras } from '@shared/interfaces';

@Component({
  selector: 'app-chart-promedio-horas',
  templateUrl: './chart-promedio-horas.component.html',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
})
export class ChartPromedioHorasComponent {
  data = input.required<PromedioPorHoras[]>();

  chartOptions = computed(() => ({
    series: [
      {
        name: 'Promedio',
        data: this.data().map(item => item.promedio),
      },
    ],
    chart: {
      type: 'bar' as any,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    yaxis: {
      title: {
        text: 'Promedio de Reservas',
      },
    },
    xaxis: {
      categories: this.data().map(item => item.hora),
      title: {
        text: 'Hora del día',
      },
      labels: {
        formatter: (val: string) => `${val?.replace(':00', '')}`,
      },
    },
    colors: ['#ffa200'],
    grid: {
      show: true,
    },
  }));

  constructor() {}
}
