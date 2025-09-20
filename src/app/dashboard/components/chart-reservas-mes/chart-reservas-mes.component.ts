import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { ReservasPorMes } from '@shared/interfaces';

@Component({
  selector: 'app-chart-reservas-mes',
  templateUrl: './chart-reservas-mes.component.html',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartReservasMesComponent {
  data = input.required<ReservasPorMes[]>();

  chartOptions = computed(() => ({
    series: [
      {
        name: 'Completadas',
        data: this.data().map(item => item.completadas),
      },
      {
        name: 'Canceladas',
        data: this.data().map(item => item.canceladas),
      },
      {
        name: 'Total',
        data: this.data().map(item => item.total),
      },
    ],
    chart: {
      type: 'line' as any,
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth' as any,
      width: 3,
    },
    xaxis: {
      categories: this.data().map(item => item.mes),
      title: {
        text: 'Meses del año',
      },
    },
    yaxis: {
      title: {
        text: 'Número de reservas',
      },
    },
    colors: ['#84cb01', '#ce013f', '#9e01e2'],
    grid: {
      show: true,
    },
  }));

  constructor() {}
}
