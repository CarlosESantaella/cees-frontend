import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-list-receptions',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
  templateUrl: './list-receptions.component.html',
  styleUrl: './list-receptions.component.css'
})
export class ListReceptionsComponent {
  // 'equipment_type', 'brand', 'model', 'serie', 'capability', 'client_id'
  // : (tipo producto, marca, modelo, número de serie, observaciones, fotos, estado)
  tableColumns: any[] = [
    { label: 'ID', field: 'custom_id' },
    // { label: 'Cliente', field: 'full_name_client' },
    { label: 'Tipo de producto', field: 'equipment_type' },
    { label: 'Marca', field: 'brand' },
    { label: 'Modelo', field: 'model' },
    { label: 'Número de serie', field: 'serie' },
    { label: 'Observaciones', field: 'capability' },
    // { label: 'cliente', field: 'client_id' },
  ];
  allData: any[] = [];

  actions: any[] = [
    {
      name: 'Recepcion',
      actions: {
        create: true,
        edit: true,
        delete: true,
        pdf: true,
        mail: true
      },
    },
  ];

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService
  ) {
    crudService.api_path_list = '/receptions';
    crudService.api_path_show = '/receptions/';
    crudService.api_path_create = '/receptions';
    crudService.api_path_update = '/receptions/';
    crudService.api_path_update_post = '/receptions/update/';
    crudService.api_path_delete = '/receptions/';

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
          message: 'Recepción creada con exito',
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
          message: 'Recepción editada con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  delete(id: any) {
    this.crudService.delete(id).subscribe((resp) => {
      console.log(resp);
      if(!resp?.error){
        this.allData = this.allData.filter((item) => item.id != id);
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Recepción eliminada con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  sendMail(id: number){
    this.crudService.get(`/receptions/${id}/send-mail`).subscribe((response: any) => {
      this.toastService.show({
        message: 'Reporte enviado con exito',
        classname: 'bg-success text-dark',
      });
    });
  }
  setIndexReception(data: any){
    let formData: any = new FormData();

    formData.append('index_reception', data);
    formData = {
      "index_reception": data
    };
    this.crudService.api_path_update_post = '/configurations';
    this.crudService.updatePost(formData, '').subscribe((resp) => {
      if(!resp?.error){
        this.toastService.show({
          message: 'Configuración de recepción editada con exito',
          classname: 'bg-success text-dark',
        });

      }
    });
  }
}



// import {Component} from '@angular/core';
// import {FormControl, FormGroup} from '@angular/forms';

// @Component({
//   selector: 'example-app',
//   template: `
//     <form [formGroup]="form">
//       <select formControlName="state">
//         <option *ngFor="let state of states" [ngValue]="state">
//           {{ state.abbrev }}
//         </option>
//       </select>
//     </form>

//      <p>Form value: {{ form.value | json }}</p>
//      <!-- {state: {name: 'New York', abbrev: 'NY'} } -->
//   `,
// })
// export class ReactiveSelectComp {
//   states = [
//     {name: 'Arizona', abbrev: 'AZ'},
//     {name: 'California', abbrev: 'CA'},
//     {name: 'Colorado', abbrev: 'CO'},
//     {name: 'New York', abbrev: 'NY'},
//     {name: 'Pennsylvania', abbrev: 'PA'},
//   ];

//   form = new FormGroup({
//     state: new FormControl(this.states[3]),
//   });
// }