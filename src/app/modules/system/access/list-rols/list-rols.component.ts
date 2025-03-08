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

@Component({
    selector: 'app-list-rols',
    imports: [
        HeaderComponent,
        FooterComponent,
        TableComponent,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './list-rols.component.html',
    styleUrl: './list-rols.component.css'
})
export class ListRolsComponent {
  private modalService = inject(NgbModal);
  closeResult = '';
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Country Name', field: 'name' },
    { label: 'Area', field: 'area', pipe: 'number' },
    { label: 'Population', field: 'population', pipe: 'number' },
  ];
  allData: any[] = [
    {
      id: 1,
      name: 'Russia',
      flag: 'f/f3/Flag_of_Russia.svg',
      area: 17075200,
      population: 146989754,
    },
    {
      id: 2,
      name: 'France',
      flag: 'c/c3/Flag_of_France.svg',
      area: 640679,
      population: 64979548,
    },
  ];

  form_create!: FormGroup;
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
  ) {
    crudService.api_path_list = '/permissions';
    crudService.api_path_show = '/profiles/';
    crudService.api_path_create = '/profiles';
    crudService.api_path_update = '/profiles/';
    crudService.api_path_delete = '/profiles/';

    crudService.auth_token = authService.token;
    this.crudService.list().subscribe((resp) => {
      this.allData = resp;
      console.log('all permisions', this.allData);

      this.all_permissions = Object.keys(resp)
        .map((key) => {
          const object_aux: any = new Object();
          object_aux.value = key;
          switch (key) {
            case 'MANAGE USERS':
              object_aux.text = 'Usuarios';
              return object_aux;

              break;
            case 'MANAGE CLIENTS':
              object_aux.text = 'Clientes';
              return object_aux;

              break;
            case 'MANAGE PROFILES':
              object_aux.text = 'Roles';
              return object_aux;

              break;
            case 'MANAGE RECEPTIONS':
              object_aux.text = 'Recepciones';
              return object_aux;

              break;
            case 'MANAGE ITEMS':
              object_aux.text = 'Items';
              return object_aux;

              break;
            case 'MANAGE RATES':
              object_aux.text = 'Tarifas';
              return object_aux;

              break;
          }
        })
        .filter((item) => item != null);

      const form_permissions: any = {};
      this.all_permissions.forEach((checkbox) => {
        form_permissions[checkbox.value] = new FormControl(false);
      });

      this.form_create = this.fb.group({
        name_create: ['', [Validators.required, Validators.minLength(3)]],
        permissions_create: this.fb.array([], this.minSelectedCheckboxes(1)),
      });

      this.addCheckboxCreate();

      console.log('this.all_permissions2: ', this.all_permissions);

      this.form_edit = this.fb.group({
        name_edit: ['', [Validators.required, Validators.minLength(3)]],
        permissions_edit: this.fb.array([], this.minSelectedCheckboxesEdit(1)),
      });
      this.addCheckboxEdit();
    });
    crudService.api_path_list = '/profiles';

    this.crudService.list().subscribe((resp) => {
      this.all_rols = resp ?? [];
      console.log('all_rols', this.all_rols);
      console.log(resp.length);
    });
  }

  minSelectedCheckboxes(min = 1): ValidatorFn {
    return function validate(
      control: AbstractControl
    ): ValidationErrors | null {
      if (!(control instanceof FormArray)) {
        return null;
      }

      const selectedCount = control.controls.reduce((count, ctrl) => {
        return ctrl.value === true ? count + 1 : count;
      }, 0);

      if (selectedCount < min) {
        return { minSelectedCheckboxes: true };
      }

      return null;
    };
  }
  minSelectedCheckboxesEdit(min = 1): ValidatorFn {
    return function validate(
      control: AbstractControl
    ): ValidationErrors | null {
      if (!(control instanceof FormArray)) {
        return null;
      }

      const selectedCount = control.controls.reduce((count, ctrl) => {
        return ctrl.value === true ? count + 1 : count;
      }, 0);

      if (selectedCount < min) {
        return { minSelectedCheckboxesEdit: true };
      }

      return null;
    };
  }

  get name_create() {
    return this.form_create.get('name_create');
  }

  get name_edit() {
    return this.form_edit.get('name_edit');
  }

  get permissionsCreateFormArray() {
    return this.form_create.controls['permissions_create'] as FormArray;
  }
  get permissionsEditFormArray() {
    return this.form_edit.controls['permissions_edit'] as FormArray;
  }

  private addCheckboxCreate() {
    this.all_permissions.forEach(() =>
      this.permissionsCreateFormArray.push(new FormControl(false))
    );
  }
  private addCheckboxEdit() {
    this.all_permissions.forEach(() =>
      this.permissionsEditFormArray.push(new FormControl(false))
    );
  }

  open(content: TemplateRef<any>, action: string, id?: any) {
    if (action == 'edit') {
      this.id_edit = id;
      let rol_edit = this.all_rols.filter(rol => rol.id == id);
      console.log(rol_edit[0].permissions);
      console.log(this.all_permissions);
      this.name_edit?.setValue(rol_edit[0].name);
      this.all_permissions.forEach((permission, i) => {
        if(rol_edit[0].permissions.hasOwnProperty(permission.value)){
          this.permissionsEditFormArray.at(i).setValue(true);
          console.log('si entro', i);
        }
        // miJson.hasOwnProperty("clave2")
      })
      console.log(this.permissionsEditFormArray);
    }

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  onClickBtn() {
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

  onSubmitEdit() {
    let permissions_edited = this.form_edit.value.permissions_edit;
    let all_permissions = this.all_permissions;
    let data_edit = permissions_edited.reduce(
      (result: any, value: any, index: any) => {
        if (value) {
          result[all_permissions[index].value] = 'OWN';
        } else {
          return result;
        }
        return result;
      },
      {}
    );

    data_edit = JSON.stringify(data_edit);
    const data: any = new Object();
    const data_to_array: any = new Object();
    data.name = this.form_edit.value.name_edit;
    data.permissions = data_edit;
    data_to_array.name = this.form_edit.value.name_edit;
    data_to_array.permissions = JSON.parse(data_edit);
    data_to_array.id = this.id_edit;

    this.crudService.update(data, this.id_edit).subscribe((resp) => {
      console.log(resp);
      if(!resp?.error){
        this.all_rols = this.all_rols.map(item => (item.id == this.id_edit)? data_to_array : item);
        // console.log(this.allData, 2);
        // this.tableComponent.initTable(this.allData);
        this.modalService.dismissAll();
        this.toastService.show({
          message: 'Rol creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });


  }

  onSubmitCreate() {
    let permissions_created = this.form_create.value.permissions_create;
    let all_permissions = this.all_permissions;
    let data_create = permissions_created.reduce(
      (result: any, value: any, index: any) => {
        if (value) {
          result[all_permissions[index].value] = 'OWN';
        }
        return result;
      },
      {}
    );

    data_create = JSON.stringify(data_create);
    const data: any = new Object();
    const data_to_array: any = new Object();
    data.name = this.form_create.value.name_create;
    data.permissions = data_create;
    data_to_array.name = this.form_create.value.name_create;
    data_to_array.permissions = JSON.parse(data_create);

    this.crudService.create(data).subscribe((resp) => {
      console.log(resp);
      if(!resp?.error){
        this.all_rols.push(data_to_array);
        // console.log(this.allData, 2);
        // this.tableComponent.initTable(this.allData);
        this.modalService.dismissAll();
        this.toastService.show({
          message: 'Rol creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

}
