import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor() { }

  private asideMenu = new Subject<void>();

  // Método para emitir el evento
  emitClickBtnMenu() {
    this.asideMenu.next();
  }

  // Método para suscribirse al evento
  onClickBtnMenu() {
    return this.asideMenu.asObservable();
  }
  
}
