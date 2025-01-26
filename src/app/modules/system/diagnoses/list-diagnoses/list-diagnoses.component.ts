import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { TableService } from 'primeng/table';

@Component({
  selector: 'app-list-diagnoses',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    TableComponent,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    FieldsetModule
  ],
  templateUrl: './list-diagnoses.component.html',
  styleUrl: './list-diagnoses.component.css',
})
export class ListDiagnosesComponent {
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  tableColumns: any[] = [
    // { label: 'Cliente', field: 'full_name_client' },
    { label: 'Estado', field: 'status', pipe: 'status_switch', html: true },
    { label: 'Fecha', field: 'initial_date', pipe: 'datetime'},
    { label: 'Formato de validación', pipe: 'files_diagnoses', html: true },
    { label: 'Diagnóstico', field: 'description' },
    { label: 'Observaciones', field: 'observations' },
    { label: 'Modo principal de falla', pipe: 'failure_modes', html: true },
    { label: 'Trabajo requerido', pipe: 'diagnoses_items', html: true },
    { label: 'Fotos de items', pipe: 'diagnoses_item_photos', html: true },
    // { label: 'cliente', field: 'client_id' },
  ];
  allData: any[] = [];
  aditionalData: any = {};
  actions: any[] = [
    {
      name: 'Diagnostico',
      actions: {
        create: true,
        edit: true,
        delete: true,
      },
    },
  ];
  isVisibleSearchReception: boolean = false;
  isSearching: boolean = false;
  existsDiagnosis: boolean = false;
  existsReception: boolean = false;
  reception: any;
  textToSearch: string = '';

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService,
    public cdr: ChangeDetectorRef
  ) {
    crudService.api_path_list = '/diagnoses';
    crudService.api_path_show = '/diagnoses/';
    crudService.api_path_create = '/diagnoses';
    crudService.api_path_update = '/diagnoses/';
    crudService.api_path_update_post = '/diagnoses/update/';
    crudService.api_path_delete = '/diagnoses/';

    crudService.auth_token = authService.token;
    // this.tableComponent.initTable([]);
    // this.crudService.list().subscribe((resp) => {
    //   console.log('resp init', resp);
    //   this.allData = resp ?? [];
    //   if(this.allData.length > 0){
    //     // this.tableComponent.initTable(this.allData);
    //   }
    // });
  }

  create(data: any) {
    this.crudService.create(data).subscribe((resp) => {
      console.log(resp);
      if (!resp?.error) {
        this.allData.push(resp);
        this.actions[0].actions.create = false;
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Diagnóstico creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    console.log(data, 'holasd d');
    this.crudService.api_path_update = '/diagnoses/';
    this.crudService.put(`/diagnoses/${data.id}`, data).subscribe((resp) => {
      
      if (!resp?.error) {
        this.allData = this.allData.map((item) =>
          item.id == resp.id ? resp : item
        );

        console.log(this.allData, 'hola mundo alldata');
        console.log(resp, 'hola mundo resp');

        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Diagnóstico editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  delete(id: any) {
    this.crudService.delete(id).subscribe((resp) => {
      if (!resp?.error) {
        this.allData = this.allData.filter((item) => item.id != id);
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Diagnóstico eliminado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  showDialogSearchReception() {
    this.isVisibleSearchReception = true;
  }

  onClickSearchReception(){
    let textToSearch = this.textToSearch.toLowerCase();
    this.isSearching = true;

    this.crudService.get(`/receptions/find?serial=${ textToSearch }`).subscribe((response: any) => {
      this.isSearching = false;
      console.log('response:', response);
      this.allData = [];
      if(response.exists == false){
        this.toastService.show({
          message: 'Recepción no encontrada',
          classname: 'bg-warning text-dark',
        });
      }else if(response.exists == true){
        this.existsReception = true;
        this.isVisibleSearchReception = false;
        this.reception = response;
        this.aditionalData.receptionId = response.id;
        if(this.reception.diagnosis){
          this.existsDiagnosis = true;
          this.actions[0].actions.create = false;
          console.log(this.reception.diagnosis);
          setTimeout(() => {
            this.tableComponent.initTable([this.reception.diagnosis]);
          }, 1000);
          
        }else{
          setTimeout(() => {
            this.tableComponent.initTable([]);
          }, 1000);
        }
        this.toastService.show({
          message: 'Recepción encontrada exitosamente!',
          classname: 'bg-success text-white',
        });
      }

    });

  }
}
