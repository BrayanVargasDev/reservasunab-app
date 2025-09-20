import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RecaudoMensual } from '@shared/interfaces';

@Component({
  selector: 'app-chart-recaudo-mensual',
  templateUrl: './chart-recaudo-mensual.component.html',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartRecaudoMensualComponent {
  data = input.required<RecaudoMensual[]>();
  private currencyPipe = inject(CurrencyPipe);

  chartOptions = computed(() => ({
    series: [
      {
        name: 'Recaudo',
        data: this.data().map(item => item.recaudo),
      },
    ],
    chart: {
      type: 'line' as any,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'straight' as any,
      width: 3,
    },
    xaxis: {
      categories: this.data().map(item => item.mes),
      title: {
        text: 'Meses del año',
      },
    },
    colors: ['#1244e3'],
    grid: {
      show: true,
    },
    yaxis: {
      title: {
        text: 'Cantidad recaudada',
      },
      labels: {
        formatter: (value: number) =>
          this.currencyPipe.transform(value, '$', 'symbol', '1.0-0') ||
          '',
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) =>
          this.currencyPipe.transform(value, '$', 'symbol', '1.0-0') ||
          '',
      },
    },
  }));

  constructor() {}
}
