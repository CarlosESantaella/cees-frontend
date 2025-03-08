import { Injectable } from '@angular/core';
import { MenuItem } from '../../../interfaces/menu-item.feature';
import { menuData } from '../main-menu';

@Injectable({
  providedIn: 'root'
})
export class MainMenuService {
  menuData: MenuItem[] = menuData;
  lastMenuState: string = '';
  constructor() { }
}
