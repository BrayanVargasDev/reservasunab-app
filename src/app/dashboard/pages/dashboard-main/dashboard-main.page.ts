import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.page.html',
  styleUrls: ['./dashboard-main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardMainPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
