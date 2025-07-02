import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservas-main',
  templateUrl: './reservas-main.page.html',
  styleUrls: ['./reservas-main.page.scss'],
  standalone: true,
  imports: [IonContent, IonContentITit cenToolbar, virmnmModule uService = tpblic sede = new FormControl('');
  public categoria = new FormControl('');
  public fechaSeleccionada = signal<string>('');
  public sedeSeleccionada = signal<number | null>(null);
  public categoriaSeleccionada = signal<number | null>(null);
  public pikaday!: Pikaday;
  public fechaPicker =
    viewChild.required<ElementRef<HTMLInputElement>>('fechaPicker');

  ngOnInit() {
  }

}
