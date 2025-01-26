import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { authGuard } from '../../../shared/guards/auth.guard';
import { ReceptionComponent } from './reception.component';
import { ListReceptionsComponent } from './list-receptions/list-receptions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    title: 'gestionar clientes del sistema',
    data: {
      permission: 'MANAGE CLIENTS'
    },
    component: ListClientsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'list',
    title: 'gestionar recepciones del sistema',
    data: {
      permission: 'MANAGE RECEPTIONS'
    },
    component: ListReceptionsComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionRoutingModule {}
