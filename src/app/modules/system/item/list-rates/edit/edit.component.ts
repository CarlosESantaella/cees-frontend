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
  clients!: any[];

  all_rols: any = [];

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService
  ) {}

  ngOnInit() {
    console.log(this.data, '2');

    this.crudService.api_path_list = '/clients';
    this.crudService.api_path_show = '/rates/';

    this.form = this.fb.group({
      selectedClients: [[], Validators.required],
    });
    this.crudService.list().subscribe((resp) => {
      this.clients = resp;

      this.crudService.show(this.data.id).subscribe((resp) => {
        let clients_selected = resp;
        clients_selected = JSON.parse(clients_selected.clients);
        clients_selected = clients_selected.map((item_id: any) => {
          let client = this.clients.filter((item: any) => item.id == item_id);
          return client[0];
        });
        // this.profile?.setValue(this.data.profile);
        this.selectedClients?.setValue(clients_selected);
      });
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

    var formData_json: any = {};

    formData.forEach(function (valor, clave) {
      // Asignar el valor al objetoJSON con la clave correspondiente
      formData_json[clave] = valor;
    });

    this.editEvent.emit(formData_json);
    this.modal.dismiss();
  }
}
