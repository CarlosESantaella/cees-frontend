import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';
import { MultiSelectModule } from 'primeng/multiselect';

// interface Client {
//   full_name: string;
//   id: number;
// }

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  clients!: any[];

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService
  ) {


    crudService.api_path_list = '/clients';

    crudService.list().subscribe((resp) => {
      console.log(resp, 'clients');
      this.clients = resp;
      // this.selectedClients?.setValue(this.all_rols[0]?.id);
    });
  }

  ngOnInit() {

    
    this.form = this.fb.group(
      {
        // name: ['', [Validators.required, Validators.minLength(6)]],
        selectedClients: [[], Validators.required]
      }
    );
  }

  get selectedClients() {
    return this.form.get('selectedClients');
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
    let formData = new FormData();
    let clients = this.form.value;
    let clients_arr: any[] = [];

    clients.selectedClients.forEach((item: any) => {
      clients_arr.push(item.id);
    });

    formData.append('clients', JSON.stringify(clients_arr));

    this.createEvent.emit(formData);
    this.modal.dismiss();
  }
}
