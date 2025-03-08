import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withNoXsrfProtection } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ignoreChangesOutsideZone: true}),
    provideAnimations(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: false || 'none'
          }
        }
    })
  ]
};
