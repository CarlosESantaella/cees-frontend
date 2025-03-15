import { Component, inject, Inject } from '@angular/core';
import { MenusService } from '../../../../shared/services/menus.service';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { MainMenuService } from '../../../../shared/components/main-menu/services/main-menu.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [ToastsContainerComponent, NgbTooltipModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  menusService: MenusService = inject(MenusService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  mainMenuService: MainMenuService = inject(MainMenuService);

  clickBtnMenu() {
    this.menusService.emitClickBtnMenu();
  }

  onBackToMenu(){
    let navigateTo: string = '/system/main-menu';
    if(this.mainMenuService.lastMenuState.trim() !== ''){
      navigateTo = this.mainMenuService.lastMenuState;
    }
    this.router.navigate([navigateTo]);
  }

  logout(){
    this.authService.logout();
  }
}
