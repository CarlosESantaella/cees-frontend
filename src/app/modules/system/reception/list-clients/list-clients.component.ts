import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { CrudService } from '../../../../shared/services/crud.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css',
})
export class ListClientsComponent {
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nombre completo', field: 'full_name' },
    { label: 'Dirección', field: 'address' },
    { label: 'NIT', field: 'identification' },
    { label: 'Contacto', field: 'contact' },
  ];
  allData: any[] = [];

  actions: any[] = [
    {
      name: 'Cliente',
      actions: {
        create: true,
        edit: true,
        delete: true,
      },
    },
  ];

  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService
  ) {
    crudService.api_path_list = '/clients';
    crudService.api_path_show = '/clients/';
    crudService.api_path_create = '/clients';
    crudService.api_path_update = '/clients/';
    crudService.api_path_delete = '/clients/';

    crudService.auth_token = authService.token;
    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.allData = resp ?? [];
      this.tableComponent.initTable(this.allData);
    });
  }

  ngOnInit() {}

  create(data: any) {
    this.crudService.create(data).subscribe((resp) => {
      console.log(resp);
      if(!resp?.error){

        this.allData.push(resp);
        console.log(this.allData, 2);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Cliente creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    console.log(data, 'holasd d');
    this.crudService.update(data, data.id).subscribe((resp) => {
      console.log(resp, 233);
      if(!resp?.error){

        this.allData = this.allData.map((item) =>
          item.id == data.id ? data : item
        );
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Cliente editado con exito',
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
          message: 'Cliente eliminado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }
}