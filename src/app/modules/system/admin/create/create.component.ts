import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './create.component.html',
    styleUrl: './create.component.css'
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  constructor(public modal: NgbActiveModal, public fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(6)]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  get name() {
    return this.form.get('name');
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  get email() {
    return this.form.get('email');
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl?.errors &&
        !matchingControl?.errors?.['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl?.value) {
        matchingControl?.setErrors({ confirmedValidator: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  onSubmit() {
    this.form.removeControl('confirmPassword');
    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
