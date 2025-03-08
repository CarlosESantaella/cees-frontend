import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, ToastsContainerComponent, RouterModule, PasswordModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public toastService: ToastService,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get password() {
    return this.form.get('password');
  }
  get username() {
    return this.form.get('username');
  }

  onSubmit() {
    this.authService
      .login(this.form.value.username, this.form.value.password)
      .subscribe(
        (resp: any) => {
          console.log('Autenticación exitosa:', resp);
          this.authService.token = resp.access_token;
          this.authService.user = JSON.stringify(resp.user);
          console.log('user:', resp.user);
          this.router.navigate(['/system/main-menu']);
          this.toastService.show({
            message:
              'Bienvenido '+resp.user.username,
            classname: 'bg-success text-dark ',
          });
        },
        (error: any) => {
          this.toastService.show({
            message:
              'Error: contraseña o usuario incorrectos, intentelo nuevamente.',
            classname: 'bg-danger text-light ',
          });

        }
      );
  }
}
