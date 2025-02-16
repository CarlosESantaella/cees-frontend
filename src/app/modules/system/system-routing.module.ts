import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemComponent } from './system.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from '../../shared/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { guestGuard } from '../../shared/guards/guest.guard';
import { LoginComponent } from './auth/login/login.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MainMenuComponent } from '../../shared/components/main-menu/main-menu.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/system/main-menu',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    title: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'auth/forgot-password',
    title: 'Ingresar email para recuperación de contraseña',
    component: ForgotPasswordComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'auth/reset-password',
    title: 'Reiniciar contraseña',
    component: ResetPasswordComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'receptions',
    loadChildren: () =>
      import('./reception/reception.module').then((m) => m.ReceptionModule),
  },
  {
    path: 'diagnoses',
    loadChildren: () =>
      import('./diagnoses/diagnoses.module').then((m) => m.DiagnosesModule),
  },
  {
    path: 'items',
    loadChildren: () => import('./item/item.module').then((m) => m.ItemModule)
  },
  {
    path: 'access',
    loadChildren: () =>
      import('./access/access.module').then((m) => m.AccessModule),
  },
  {
    path: 'main-menu',
    component: MainMenuComponent,
  },
  {
    path: 'main-menu/:firstLevel',
    component: MainMenuComponent,
  },
  {
    path: 'main-menu/:firstLevel/:secondLevel',
    component: MainMenuComponent,
  },
  {
    path: 'admins',
    title: 'gestionar administradores',
    data: {
      permission: 'MANAGE ADMINS'
    },
    component: AdminComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    title: 'inicio del sistema',
    data: {
      permission: 'MANAGE HOME'
    },
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'configurations',
    title: 'configuración del sistema',
    data: {
      permission: 'MANAGE CONFIGURATION'
    },
    component: ConfigurationComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
