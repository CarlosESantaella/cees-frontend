import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;

  constructor(public modal: NgbActiveModal, public fb: FormBuilder) {

  }

  ngOnInit() {
    console.log(this.data,'2');
    this.form = this.fb.group(
      {
        name: [this.data.name ?? '', [Validators.required, Validators.minLength(6)]],
        username: [this.data.username ?? '', [Validators.required]],
        email: [this.data.email ?? '', [Validators.required, Validators.email]],
        password: [this.data.password ?? '', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [this.data.password ?? '', Validators.required],
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
    this.form.addControl('id', this.fb.control(this.data.id));
    this.editEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
