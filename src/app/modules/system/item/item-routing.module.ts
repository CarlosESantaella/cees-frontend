import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListItemsComponent } from './list-items/list-items.component';
import { authGuard } from '../../../shared/guards/auth.guard';
import { ListRatesComponent } from './list-rates/list-rates.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    title: 'gestionar items del sistema',
    data: {
      permission: 'MANAGE ITEMS'
    },
    component: ListItemsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'rates',
    title: 'gestionar tarifas del sistema',
    data: {
      permission: 'MANAGE RATES'
    },
    component: ListRatesComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
