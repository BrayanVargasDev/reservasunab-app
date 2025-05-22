import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from '../web-icon/web-icon.component';

@Component({
  selector: 'app-table-expansor',
  templateUrl: './table-expansor.component.html',
  styleUrls: ['./table-expansor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton, WebIconComponent],
})
export class TableExpansorComponent {
  appService = inject(AppService);

  isExpanded = input<boolean>(false);
  color = input<string>('primary');
  toggleExpand = output<boolean>();

  toggle() {
    this.toggleExpand.emit(!this.isExpanded);
  }
}
