import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-expansor',
  templateUrl: './table-expansor.component.html',
  styleUrls: ['./table-expansor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton],
})
export class TableExpansorComponent {
  isExpanded = input<boolean>(false);
  color = input<string>('primary');
  toggleExpand = output<boolean>();

  toggle() {
    this.toggleExpand.emit(!this.isExpanded);
  }
}
