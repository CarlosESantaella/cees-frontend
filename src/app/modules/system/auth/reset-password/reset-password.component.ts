import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { PasswordModule } from 'primeng/password';
import { CrudService } from '../../../../shared/services/crud.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ToastsContainerComponent,
    PasswordModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  form!: FormGroup;
  token!: string;
  isTokenValidated: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public toastService: ToastService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public crudService: CrudService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
    });
    const queryParams = this.activeRoute.snapshot.queryParams;
    const token = queryParams['token'];
    if(!token){
      this.router.navigate(['/system/auth/login']);
    }
    this.token = token;

    this.isTokenValidated = true;
    console.log('Received token:', this.token);
    this.crudService.post('/auth/validate-reset-password-token', { token: this.token }).subscribe({
      next: (resp: any) => {
        console.log('Token validation:', resp);
        if (resp.status == 401) {
          this.isTokenValidated = false;
        } else {
          this.isTokenValidated = true;
        }
      },
      error: (error: any) => {
        this.isTokenValidated = false;
      },
    });
  }

  matchPasswordValidator(control: any): { [key: string]: boolean } | null {
    if (this.form && control.value !== this.form.get('password')?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  get password() {
    return this.form.get('password');
  }
  get repeatPassword() {
    return this.form.get('repeatPassword');
  }

  onSubmit() {
    this.authService
      .resetPassword(this.form.value.password, this.token)
      .subscribe({
        next: (resp: any) => {
          this.toastService.show({
            message: 'Contraseña reestablecida correctamente.',
            classname: 'bg-success text-dark',
          });
          this.router.navigate(['/system/auth/login']);
        },
        error: (error: any) => {
          this.toastService.show({
            message: 'Error: correo electrónico no encontrado.',
            classname: 'bg-danger text-light ',
          });
        },
      });
  }
}
