import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SideMenuComponent } from "../components/side-menu/side-menu.component";
import { HeaderComponent } from "../components/header/header.component";

@Component({
  selector: 'app-main-layout',
  imports: [IonicModule, CommonModule, SideMenuComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
