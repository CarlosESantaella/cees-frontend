import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, finalize, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);



  if(authService.token == '' || authService.token == null || authService.token == undefined){
    return router.createUrlTree(['/system/auth/login']);
  }
  
  return true;

};
