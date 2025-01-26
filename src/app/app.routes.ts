import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';

export const routes: Routes = [
  {
    path: 'system',
    loadChildren: () =>
      import('./modules/system/system.module').then((m) => m.SystemModule)
  },
  {
    path: '',
    redirectTo: 'system/auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];
