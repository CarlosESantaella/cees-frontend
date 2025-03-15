import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';

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

  all_rols: any = [];

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        // profile: ['', Validators.required],
      },
      {
        validator: this.ConfirmedValidator('password', 'confirm_password'),
      }
    );

    crudService.api_path_list = '/profiles';

    this.crudService.list().subscribe((resp) => {
      this.all_rols = resp;
      this.profile?.setValue(this.all_rols[0]?.id);
      console.log(resp);
    });

  }

  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get confirm_password() {
    return this.form.get('confirm_password');
  }
  get email() {
    return this.form.get('email');
  }
  get profile() {
    return this.form.get('profile');
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
    this.form.removeControl('confirm_password');
    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
