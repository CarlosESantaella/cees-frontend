import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastsContainerComponent } from '../../../../shared/components/toast/container-toast.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ToastsContainerComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public toastService: ToastService,
    public router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  get email() {
    return this.form.get('email');
  }

  onSubmit() {
    this.isSubmitting = true;
    console.log(this.form.value.email);
    this.authService
      .forgotPassword(this.form.value.email)
      .subscribe({
        next: (resp: any) => {
          console.log('Autenticación exitosa:', resp);
          this.toastService.show({
            message: 'Se ha enviado un correo electrónico para restablecer la contraseña.',
            classname: 'bg-success text-dark',
          });
        },
        error: (error: any) => {
          this.toastService.show({
            message: 'Error: correo electrónico no encontrado.',
            classname: 'bg-danger text-light ',
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}
