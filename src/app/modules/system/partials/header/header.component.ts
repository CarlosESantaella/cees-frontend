import { Component } from '@angular/core';
import { MenusService } from '../../../../shared/services/menus.service';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToastsContainerComponent, NgbTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private menusService: MenusService,
    private authService: AuthService,
    private router: Router
  ){}

  clickBtnMenu() {
    this.menusService.emitClickBtnMenu();
  }

  onBackToMenu(){
    this.router.navigate(['/system/main-menu']);
  }

  logout(){
    this.authService.logout();
  }
}
