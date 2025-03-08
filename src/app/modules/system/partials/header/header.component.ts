import { Component } from '@angular/core';
import { MenusService } from '../../../../shared/services/menus.service';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { MainMenuService } from '../../../../shared/components/main-menu/services/main-menu.service';

@Component({
    selector: 'app-header',
    imports: [ToastsContainerComponent, NgbTooltipModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private menusService: MenusService,
    private authService: AuthService,
    private router: Router,
    private mainMenuService: MainMenuService
  ){}

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
