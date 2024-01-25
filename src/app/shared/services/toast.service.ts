import {
  Component,
  ElementRef,
  Injectable,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];


  constructor() {

  }

  // ngOnInit(){
  //   this.toast.message = 'hola mundo';
  // }

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  removeAll(){
    this.toasts = [];
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
