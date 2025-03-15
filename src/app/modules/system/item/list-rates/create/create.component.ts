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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  clients!: any[];
  currency: string = '';

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
        selectedClients: [[], Validators.required],
        gross_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        indirect_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        utility: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        total_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      }
    );

    this.crudService.api_path_show = '/configurations';

    this.crudService.show('').subscribe((resp: any) => {
      this.currency = resp.currency;
    });
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
  get gross_cost() {
    return this.form.get('gross_cost');
  }
  get indirect_cost() {
    return this.form.get('indirect_cost');
  }
  get utility() {
    return this.form.get('utility');
  }
  get total_cost() {
    return this.form.get('total_cost');
  }

  totalCostCalculate() {
    let gross_cost = parseInt((this.gross_cost?.value == '') ? 0 : this.gross_cost?.value);
    let indirect_cost = parseInt((this.indirect_cost?.value == '') ? 0 : this.indirect_cost?.value);
    let utility = parseInt((this.utility?.value == '') ? 0 : this.utility?.value);
    console.log(gross_cost, indirect_cost, utility);
    this.total_cost?.setValue(gross_cost + indirect_cost + utility);
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
    let clients = this.form.value.selectedClients;
    let clients_arr: any[] = [];

    clients.forEach((item: any) => {
      clients_arr.push(item.id);
    });

    formData.append('clients', JSON.stringify(clients_arr));
    formData.append('gross_cost', this.gross_cost?.value || '');
    formData.append('indirect_cost', this.indirect_cost?.value || '');
    formData.append('utility', this.utility?.value || '');
    formData.append('total_cost', this.total_cost?.value || '');

    this.createEvent.emit(formData);
    this.modal.dismiss();
  }
}
