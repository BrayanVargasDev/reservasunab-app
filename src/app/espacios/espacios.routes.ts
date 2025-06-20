import { Routes } from '@angular/router';

export const espaciosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layout/layout.page').then(m => m.LayoutPage),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/espacios-main/espacios-main.page').then(
            m => m.EspaciosMainPage,
          ),
      },
      {
        path: 'configuracion/:id',
        loadComponent: () =>
          import('./pages/configuracion/configuracion.page').then(
            m => m.ConfiguracionPage,
          ),
      },
    ],
  },
];
