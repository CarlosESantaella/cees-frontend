import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';
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
import { set } from 'date-fns';

@Component({
  selector: 'app-list-rols-v3',
  imports: [
    HeaderComponent,
    FooterComponent,
    TableComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './list-rols-v3.component.html',
  styleUrl: './list-rols-v3.component.css'
})
export class ListRolsV3Component {
  private modalService = inject(NgbModal);
  closeResult = '';
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Usuario', field: 'user_username' },
    { label: 'Gestión administrativa', field: 'admin-management', pipe: 'permission_switch', html: true },
    { label: 'Gestión de servicios', field: 'service-management', pipe: 'permission_switch', html: true },
    { label: 'Gestión de inventario y compra', field: 'inventory-purchase-management', pipe: 'permission_switch', html: true },
    { label: 'Operaciones', field: 'operations', pipe: 'permission_switch', html: true },
    { label: 'Seguimiento de equipos', field: 'equipment-tracking', pipe: 'permission_switch', html: true },
    { label: 'Gestión documental', field: 'document-management', pipe: 'permission_switch', html: true },
    { label: 'Configuraciones', field: 'configurations', pipe: 'permission_switch', html: true },
  ];
  allData: any[] = [];
  actions: any[] = [
    {
      name: 'Módulo',
      actions: {
        create: true,
        delete: true
      },
    },
  ];

  form_edit!: FormGroup;

  all_permissions: any[] = [];
  all_rols: any[] = [];

  id_edit: any;

  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService,
    public fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.crudService.api_path_list = '/permissions';
    this.crudService.api_path_show = '/profiles/';
    this.crudService.api_path_create = '/profiles';
    this.crudService.api_path_update = '/profiles/';
    this.crudService.api_path_delete = '/profiles/';


    this.crudService.auth_token = this.authService.token;
    this.crudService.list().subscribe((resp) => {
      // this.allData = resp;
      console.log('permisions', this.allData);

    });
    this.crudService.api_path_list = '/profiles';

    this.crudService.list().subscribe((resp) => {
      this.all_rols = resp || [];
      this.allData = resp || [];
      this.tableComponent.initTable(this.allData);
      console.log('all_rols', this.all_rols);
      console.log('allData', this.allData);
      console.log(resp.length);
    });
  }

  get permissionsEditFormArray() {
    return this.form_edit.controls['permissions_edit'] as FormArray;
  }


  create(data: any) {
    this.crudService.create(data)
      .subscribe(
        (resp) => {
          if (!resp?.error) {
            setTimeout(() => {
              console.log('resp create', resp);
              this.allData = [...this.allData, resp];
              this.tableComponent.initTable(this.allData);
              this.toastService.show({ message: 'Rol creado con exito', classname: 'bg-success text-dark' });
            }, 10);
          }
        }
      )
  }

  edit(data: any) {
    this.crudService.update(data, data.id)
      .subscribe(
        (resp) => {
          if (!resp?.error) {
            this.allData = this.allData.map(item => (item.id == data.id) ? data : item);
            this.tableComponent.initTable(this.allData);
            this.toastService.show({ message: 'Rol editado con exito', classname: 'bg-success text-dark' });
          }
        }
      )
  }

  delete(id: any) {
    this.crudService.delete(id)
      .subscribe(
        (resp) => {
          if (!resp?.error) {
            this.allData = this.allData.filter((item) => item.id != id);
            this.tableComponent.initTable(this.allData);
            this.toastService.show({ message: 'Rol eliminado con exito', classname: 'bg-success text-dark' });

          }
        }
      )
  }

  private getDismissReason(reason: any): string {
    this.permissionsEditFormArray.controls.forEach((item, i) => {
      this.permissionsEditFormArray.at(i).setValue(false);
    })
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
