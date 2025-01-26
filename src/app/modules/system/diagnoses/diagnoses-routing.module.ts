import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDiagnosesComponent } from './list-diagnoses/list-diagnoses.component';
import { authGuard } from '../../../shared/guards/auth.guard';
import { ListFailureModesComponent } from './list-failure-modes/list-failure-modes.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    title: 'gestionar diagnósticos del sistema',
    data: {
      permission: 'MANAGE DIAGNOSES AND QUOTE'
    },
    component: ListDiagnosesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'failure-modes/list',
    title: 'gestionar modos de falla del sistema',
    data: {
      permission: 'MANAGE FAILURE MODES'
    },
    component: ListFailureModesComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosesRoutingModule {}
