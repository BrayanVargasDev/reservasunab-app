import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  host: {
    class: 'flex flex-col w-full h-full overflow-hidden relative',
  }
})
export class LayoutPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
