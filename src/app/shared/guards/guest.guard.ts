import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(authService.token == '' || authService.token == null || authService.token == undefined){
    return true;
  }else{
    return router.createUrlTree(['/system/main-menu']);
  }
};
