import { Component, inject, Inject } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.feature';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, UrlSegment } from '@angular/router';
import { menuData } from './main-menu';
import { SharedModule } from '../../shared.module';
import { AnimatedBackgroundComponent } from "../animated-background/animated-background.component";
import { AuthService } from '../../services/auth.service';
import { MainMenuService } from './services/main-menu.service';

@Component({
    selector: 'app-main-menu',
    imports: [CommonModule, RouterModule, AnimatedBackgroundComponent],
    templateUrl: './main-menu.component.html',
    styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  menuStack: string[] = [];
  currentMenu: MenuItem[] = [];

  router: Router = inject(Router);
  mainMenuService: MainMenuService = inject(MainMenuService);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
  ) { }

  ngOnInit(): void {
    this.currentMenu = this.mainMenuService.menuData;
    this.route.url.subscribe(urlSegments => {
      const fullPath = urlSegments.map(segment => segment.path).join('/');
      let user = JSON.parse(this.authService.user);
      let userPermissions: any = user.profile_data.permissions;
      userPermissions = Object.keys(userPermissions);

      console.log('userPermissions', userPermissions);
      this.mainMenuService.menuData = this.filterMenuByPermissions(userPermissions, this.mainMenuService.menuData);
      console.log(this.mainMenuService.menuData)
      this.currentMenu = this.mainMenuService.menuData;
      if (fullPath && fullPath !== 'main-menu') {
        this.updateMenuFromPath(fullPath);
      } else {
        this.resetMenu();
      }
    });
  }

  filterMenuByPermissions(permissions: string[], menuItems: MenuItem[]): MenuItem[] {
    return menuItems
      .map(menuItem => {
        const filteredChildren = menuItem.children ? this.filterMenuByPermissions(permissions, menuItem.children) : [];
        const hasPermission = menuItem.permissions.some(p => permissions.includes(p));
        if (hasPermission || filteredChildren.length > 0) {
          return { ...menuItem, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];
  }

  resetMenu(): void {
    this.menuStack = [];
    this.currentMenu = this.mainMenuService.menuData;
  }

  updateMenuFromPath(menuPath: string): void {
    const pathSegments = menuPath.split('/');
    console.log('pathSegments', pathSegments);
    let currentLevel = this.currentMenu;

    this.menuStack = [];

    for (const segment of pathSegments) {
      const menuItem = currentLevel.find(item => item.route === segment);
      if (menuItem) {
        this.menuStack.push(menuItem.route!);
        if (menuItem.children) {
          currentLevel = menuItem.children;
        }
      } else {
        if (segment === 'main-menu') continue;
        console.error(`Ruta no encontrada: ${segment}`);
        this.router.navigate(['/system/main-menu']);
        return;
      }
    }
    this.currentMenu = Array.isArray(currentLevel) ? currentLevel : [];
  }

  navigateTo(menuItem: MenuItem): void {
    if (menuItem.children && menuItem.children.length > 0) {
      // Si tiene hijos, navega hacia la ruta del ítem y actualiza el stack
      this.menuStack.push(menuItem.route!);
      this.currentMenu = menuItem.children;

      // Construye la nueva ruta dinámica
      const newRoute = this.buildRoute();
      console.log('newRoute', newRoute);
      this.mainMenuService.lastMenuState = newRoute;
      this.router.navigate([newRoute]);
    } else if (menuItem.route) {
      // Si no tiene hijos, navega directamente a la ruta
      this.currentMenu = [];
      let navigateTo: string = menuItem.route;
      this.resetMenu();
      this.router.navigateByUrl(String(navigateTo));
      this.currentMenu = [];
    }
  }

  buildRoute(): string {
    console.log('full route: ', `/system/main-menu/${this.menuStack.join('/')}`);
    return `/system/main-menu/${this.menuStack.join('/')}`;
  }

  goBack(): void {
    if (this.menuStack.length > 0) {
      this.menuStack.pop();
      this.currentMenu = this.rebuildMenuFromStack();
      const newRoute = this.buildRoute();
      this.router.navigate([newRoute || '/system/main-menu']);
    }
  }
  rebuildMenuFromStack(): MenuItem[] {
    let currentLevel = this.mainMenuService.menuData;

    for (const segment of this.menuStack) {
      const menuItem = currentLevel.find(item => item.route === segment);
      if (menuItem && menuItem.children) {
        currentLevel = menuItem.children;
      } else {
        console.error(`Ruta no encontrada: ${segment}`);
        this.router.navigate(['/system/main-menu']); // Redirige al menú principal si hay un error
        return [];
      }
    }

    return currentLevel;
  }
}
