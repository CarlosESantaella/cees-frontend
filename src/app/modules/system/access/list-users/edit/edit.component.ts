import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;

  all_rols: any = [];

  constructor(public modal: NgbActiveModal, public fb: FormBuilder, public crudService: CrudService) {
    
  }

  ngOnInit() {
    console.log(this.data,'2');
    this.form = this.fb.group(
      {
        name: [this.data.name ?? '', [Validators.required, Validators.minLength(6)]],
        email: [this.data.email ?? '', [Validators.required, Validators.email]],
        password: [this.data.password ?? '', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        profile: ['', Validators.required],
      },
      {
        validator: this.ConfirmedValidator('password', 'confirm_password'),
      }
    );

    this.crudService.api_path_list = '/profiles';

    this.crudService.list().subscribe((resp) => {
      this.all_rols = resp;
      this.profile?.setValue(this.data.profile);
      console.log(resp);
    });
  }

  get name() {
    return this.form.get('name');
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
    this.form.addControl('id', this.fb.control(this.data.id));
    this.editEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
