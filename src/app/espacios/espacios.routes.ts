import { Routes } from '@angular/router';

export const espaciosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/espacios-main/espacios-main.page').then(
        m => m.EspaciosMainPage,
      ),
  },
];
