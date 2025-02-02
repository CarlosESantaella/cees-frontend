import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.feature';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { menuData } from './main-menu';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  menuStack: MenuItem[][] = []; // Pila para rastrear el historial de menús
  currentMenu: MenuItem[] = []; // Menú actual
  menuData: MenuItem[] = menuData;

  constructor(
    public router: Router
  ) {
    this.currentMenu = this.menuData;
    this.menuStack.push(this.currentMenu);
  }

  getMenu(): MenuItem[] {
    return this.menuData;
  }

  getMenuForUser(menu: MenuItem[], userPermissions: string[]): MenuItem[] {
    return menu
      .filter(item => {
        if (!item.permissions || item.permissions.length === 0) return true; // Sin permisos requeridos
        return item.permissions.some(permission => userPermissions.includes(permission)); // Al menos uno
      })
      .map(item => {
        if (item.children) {
          item.children = this.getMenuForUser(item.children, userPermissions); // Filtra recursivamente
        }
        return item;
      })
      .filter(item => {
        return item.route || (item.children && item.children.length > 0); // Elimina ítems vacíos
      });
  }

  navigateTo(menuItem: MenuItem) {
    if (menuItem.children) {
      this.menuStack.push(menuItem.children);
      this.currentMenu = menuItem.children;
    } else if (menuItem.route) {
      this.router.navigate([menuItem.route]);
    }
  }

  goBack() {
    if (this.menuStack.length > 1) {
      this.menuStack.pop();
      this.currentMenu = this.menuStack[this.menuStack.length - 1];
    }
  }
}
