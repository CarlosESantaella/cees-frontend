import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../shared/guards/auth.guard';
import { ListRolsComponent } from './list-rols/list-rols.component';
import { ListUsersComponent } from './list-users/list-users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    title: 'gestionar usuarios del sistema',
    data: {
      permission: 'MANAGE USERS'
    },
    component: ListUsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'rols',
    title: 'gestionar roles del sistema',
    data: {
      permission: 'MANAGE PROFILES'
    },
    component: ListRolsComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }
