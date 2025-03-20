import { Injectable } from '@angular/core';
import { MenuItem } from '../../../interfaces/menu-item.feature';
import { menuData } from '../main-menu';

@Injectable({
  providedIn: 'root'
})
export class MainMenuService {
  originalMenuData: MenuItem[] = menuData;
  menuData: MenuItem[] = menuData;
  lastMenuState: string = '';
  constructor() { }

  resetMenuData(): void {
    this.menuData = [...this.originalMenuData];
  }
}
