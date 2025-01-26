import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  afterRender,
} from '@angular/core';
import { MenusService } from '../../../../shared/services/menus.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { CrudService } from '../../../../shared/services/crud.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  width_screen: number = 0;
  isRecepcionesActive: boolean = false;

  counter: number = 0;

  aside_ref: any = '';
  drawer_overlay_ref: any = '';

  route_title: string | undefined = '';

  permissions: string[] = [];

  @ViewChild('receptions') receptions_option?: ElementRef;
  @ViewChild('items') items_option?: ElementRef;
  @ViewChild('diagnoses') diagnoses_option?: ElementRef;
  @ViewChild('access') access_option?: ElementRef;
  @ViewChild('subMenuReceptions') subMenuReceptions?: ElementRef;
  @ViewChild('aside') aside?: ElementRef;
  @ViewChild('drawer_overlay') drawer_overlay?: ElementRef;

  constructor(
    private menusService: MenusService,
    private router: Router,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public crudService: CrudService,
    public authService: AuthService
  ) {
    this.aside_ref = this.aside?.nativeElement;
    this.drawer_overlay_ref = this.drawer_overlay?.nativeElement;

    activatedRoute.data.subscribe((data) => {
      this.route_title = data['permission'];
    });
    let permissions_json = JSON.parse(authService.user).profile_data.permissions;

    

    Object.entries(permissions_json).forEach(([key, value]) => {
      this.permissions.push(key);
    });
    console.log(this.permissions, 'permisos');

    if(JSON.parse(authService.user).profile == 1){
      this.permissions = ['MANAGE ADMINS'];
    }

    // if(!this.permissions.includes(this.route_title ?? '')){
    //   this.router.navigate(['system/home']);
    //   return;
    // }

    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.width_screen = window.innerWidth;

    this.aside_ref = this.aside?.nativeElement;
    this.drawer_overlay_ref = this.drawer_overlay?.nativeElement;
    if (this.width_screen < 992) {
      this.renderer.addClass(this.aside_ref, 'drawer');
      this.renderer.addClass(this.aside_ref, 'drawer-start');

      if (this.aside_ref.classList.contains('drawer-on')) {
        this.renderer.addClass(this.drawer_overlay_ref, 'd-block');
      }
    } else {
      this.renderer.removeClass(this.aside_ref, 'drawer');
      this.renderer.removeClass(this.aside_ref, 'drawer-start');

      this.renderer.removeClass(this.drawer_overlay_ref, 'd-block');
    }
  }

  ngAfterViewInit() {
    this.width_screen = window.innerWidth;
    this.aside_ref = this.aside?.nativeElement;
    if (this.width_screen < 992) {
      this.renderer.addClass(this.aside_ref, 'drawer');
      this.renderer.addClass(this.aside_ref, 'drawer-start');
    }

    // Suscribirse al evento cuando el componente se inicia
    this.menusService.onClickBtnMenu().subscribe(() => {
      this.aside_ref = this.aside?.nativeElement;
      this.drawer_overlay_ref = this.drawer_overlay?.nativeElement;
      this.renderer.addClass(this.drawer_overlay_ref, 'd-block');

      this.renderer.addClass(this.aside_ref, 'drawer-on');
    });
    this.openMainOption();

  }
 

  openMainOption() {
    console.log(this.router.url);
    if (this.router.url.includes('receptions')) {
      let element = this.receptions_option?.nativeElement;
      element.classList.add('hover', 'showing');
      const children = element.children[1] as HTMLElement;
      children.style.display = 'block';
      children.style.maxHeight = children.scrollHeight + 'px';
      setTimeout(() => {
        element.classList.remove('showing');
        element.classList.add('show');
        this.cdr.detectChanges();
      }, 300);
    }
    if (this.router.url.includes('access')) {
      let element = this.access_option?.nativeElement;
      element.classList.add('hover', 'showing');
      const children = element.children[1] as HTMLElement;
      children.style.display = 'block';
      children.style.maxHeight = children.scrollHeight + 'px';
      setTimeout(() => {
        element.classList.remove('showing');
        element.classList.add('show');
        this.cdr.detectChanges();
      }, 300);
    }
    if (this.router.url.includes('items')) {
      let element = this.items_option?.nativeElement;
      element.classList.add('hover', 'showing');
      const children = element.children[1] as HTMLElement;
      children.style.display = 'block';
      children.style.maxHeight = children.scrollHeight + 'px';
      setTimeout(() => {
        element.classList.remove('showing');
        element.classList.add('show');
        this.cdr.detectChanges();
      }, 300);
    }
    if (this.router.url.includes('diagnoses')) {
      let element = this.diagnoses_option?.nativeElement;
      element.classList.add('hover', 'showing');
      const children = element.children[1] as HTMLElement;
      children.style.display = 'block';
      children.style.maxHeight = children.scrollHeight + 'px';
      setTimeout(() => {
        element.classList.remove('showing');
        element.classList.add('show');
        this.cdr.detectChanges();
      }, 300);
    }
  }

  openOption(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget.parentNode as HTMLElement;
    if (element.classList.contains('show')) {
      if (!element.classList.contains('hidding')) {
        element.classList.add('hidding');
        const children = element.children[1] as HTMLElement;

        children.style.maxHeight = '0px';
        setTimeout(() => {
          children.style.display = 'none';
          element.classList.remove('hidding', 'show', 'hover');
        }, 300);
      }
    } else {
      if (!element.classList.contains('showing')) {
        element.classList.add('hover', 'showing');
        const children = element.children[1] as HTMLElement;
        children.style.display = 'block';
        children.style.maxHeight = children.scrollHeight + 'px';
        setTimeout(() => {
          element.classList.remove('showing');
          element.classList.add('show');
        }, 300);
      }
    }
  }

  openSubOption(event: any) {}

  hideMenu() {
    this.renderer.removeClass(this.drawer_overlay_ref, 'd-block');
    this.renderer.removeClass(this.aside_ref, 'drawer-on');
  }


  validateOptions(options: string[]){
    if(this.permissions){
      let option_exists = false;
      
      options.forEach((value: string, i: number)=> {
        if(this.permissions.includes(value)){
          option_exists = true;
        }
      });
      return option_exists;
    }
    return false;
  }
}
