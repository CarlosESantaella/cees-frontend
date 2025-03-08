import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';

@Component({
    selector: 'app-list-failure-modes',
    imports: [HeaderComponent, FooterComponent, TableComponent],
    templateUrl: './list-failure-modes.component.html',
    styleUrl: './list-failure-modes.component.css'
})
export class ListFailureModesComponent {
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Descripción del modo de falla', field: 'failure_mode' },
  ];
  allData: any[] = [];
  actions: any[] = [
    {
      name: "Modo de falla",
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
    crudService.api_path_list = '/failure-modes';
    crudService.api_path_show = '/failure-modes/';
    crudService.api_path_create = '/failure-modes';
    crudService.api_path_update = '/failure-modes/';
    crudService.api_path_update_post = '/failure-modes/update/';
    crudService.api_path_delete = '/failure-modes/';

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
          message: 'Modo de falla creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    console.log(data.get('id'), 'holasd d');
    data = {
      id: data.get('id'),
      failure_mode: data.get('failure_mode')
    };
    this.crudService.update(data, data.id).subscribe((resp) => {
      console.log(resp, 2334);
      if(!resp?.error){

        this.allData = this.allData.map((item) =>
          item.id == resp.id ? resp : item
        );


        console.log(this.allData, 'hola mundo alldata');
        console.log(resp, 'hola mundo resp');

        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Modo de falla editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  delete(id: any) {
    this.crudService.delete(id).subscribe((resp) => {
      if(!resp?.error){
        this.allData = this.allData.filter((item) => item.id != id);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Modo de falla eliminado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }
}
