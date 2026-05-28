import { Routes } from '@angular/router';
import { TarjetaCreditoComponent } from './features/tarjeta-credito/tarjeta-credito.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tarjeta'
  },
  {
    path: 'tarjeta',
    component: TarjetaCreditoComponent
  }
];
