import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-edit',
    imports: [CommonModule, ReactiveFormsModule, MultiSelectModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  clients: any[] = [];
  currency: string = '';
  all_rols: any = [];

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      selectedClients: [[], Validators.required],
      gross_cost: [this.data?.gross_cost || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      indirect_cost: [this.data?.indirect_cost || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      utility: [this.data?.utility || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      total_cost: [this.data?.total_cost || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.crudService.api_path_list = '/clients';

    this.crudService.list().subscribe((resp) => {
      this.clients = resp;

      this.crudService.api_path_show = '/rates/';
      this.crudService.show(this.data.id).subscribe((resp) => {
        let clients_selected = resp;
        clients_selected = JSON.parse(clients_selected.clients);
        clients_selected = clients_selected.map((item_id: any) => {
          let client = this.clients.filter((item: any) => item.id == item_id);
          return client[0];
        });
        console.log('clients_selected', clients_selected);
        // this.profile?.setValue(this.data.profile);
        this.selectedClients?.setValue(clients_selected);
      });
    });
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

  onSubmit() {
    // this.form.addControl('id', this.fb.control(this.data.id));
    let formData = new FormData();
    let clients = this.form.value;
    let clients_arr: any[] = [];

    clients.selectedClients.forEach((item: any) => {
      clients_arr.push(item.id);
    });

    formData.append('clients', JSON.stringify(clients_arr));
    formData.append('id', this.data.id);
    formData.append('gross_cost', this.gross_cost?.value || '');
    formData.append('indirect_cost', this.indirect_cost?.value || '');
    formData.append('utility', this.utility?.value || '');
    formData.append('total_cost', this.total_cost?.value || '');

    var formData_json: any = {};

    formData.forEach(function (valor, clave) {
      // Asignar el valor al objetoJSON con la clave correspondiente
      formData_json[clave] = valor;
    });

    this.editEvent.emit(formData_json);
    this.modal.dismiss();
  }
}
