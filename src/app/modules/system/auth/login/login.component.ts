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
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastsContainerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get password() {
    return this.form.get('password');
  }
  get email() {
    return this.form.get('email');
  }

  onSubmit() {
    // this.toastService.show({ message: 'Error: contraseña o email incorrectos, intentelo nuevamente.', classname: 'bg-danger text-light ' });

    console.log(this.form.value.email, this.form.value.password);
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe(
        (resp: any) => {
          // Maneja el resultado exitoso aquí
          console.log('Autenticación exitosa:', resp);
          this.authService.token = resp.access_token;
          this.authService.user = JSON.stringify(resp.user);
          this.router.navigate(['/system/home']);
          this.toastService.show({
            message:
              'Bienvenido '+resp.user.name,
            classname: 'bg-success text-dark ',
          });
        },
        (error: any) => {
          // Maneja el error aquí
          this.toastService.show({
            message:
              'Error: contraseña o email incorrectos, intentelo nuevamente.',
            classname: 'bg-danger text-light ',
          });

        }
      );
  }
}
