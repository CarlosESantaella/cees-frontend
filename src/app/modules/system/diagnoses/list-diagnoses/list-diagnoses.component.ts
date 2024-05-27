import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-list-diagnoses',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
  templateUrl: './list-diagnoses.component.html',
  styleUrl: './list-diagnoses.component.css'
})
export class ListDiagnosesComponent {
  tableColumns: any[] = [
    // { label: 'Cliente', field: 'full_name_client' },
    { label: 'Estado', field: 'status', pipe: 'status_switch', html: true },
    { label: 'Fecha', field: 'created_at', pipe: 'date' },
    { label: 'Formato de validación', pipe: 'files_diagnoses', html: true },
    { label: 'Descripción', field: 'description' },
    { label: 'Modo principal de falla', pipe: 'failure_modes' , html: true },
    // { label: 'cliente', field: 'client_id' },
  ];
  allData: any[] = [];
  actions: any[] = [
    {
      name: "Diagnostico",
      actions: {
        create: true,
        edit: true,
        delete: true
      },
    },
  ];

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService
  ){
    crudService.api_path_list = '/diagnoses';
    crudService.api_path_show = '/diagnoses/';
    crudService.api_path_create = '/diagnoses';
    crudService.api_path_update = '/diagnoses/';
    crudService.api_path_update_post = '/diagnoses/update/';
    crudService.api_path_delete = '/diagnoses/';

    crudService.auth_token = authService.token;
    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.allData = resp ?? [];
      this.tableComponent.initTable(this.allData);
    });
  }

  @ViewChild(TableComponent) tableComponent!: TableComponent;


  create(data: any) {
    this.crudService.create(data).subscribe((resp) => {
      console.log(resp);
      if(!resp?.error){

        this.allData.push(resp);
        console.log(this.allData, 2);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Diagnóstico creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    console.log(data.get('id'), 'holasd d');
    this.crudService.api_path_update = '/receptions/';
    this.crudService.updatePost(data, data.get('id')).subscribe((resp) => {
      console.log(resp, 2334);
      if(!resp?.error){

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
      if(!resp?.error){
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


}
