import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';




@Component({
    selector: 'app-list-users',
    imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
    templateUrl: './list-users.component.html',
    styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
 
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nombre del usuario', field: 'username' },
    { label: 'Email', field: 'email' }
  ];
  allData: any[] = [];

  actions: any[] = [
    {
      name: 'Usuario',
      actions: {
        create: true,
        edit: true,
        delete: true
      },
    },
  ];

  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService
  ){
    crudService.api_path_list = '/users';
    crudService.api_path_show = '/users/';
    crudService.api_path_create = '/users';
    crudService.api_path_update = '/users/';
    crudService.api_path_delete = '/users/';

    crudService.auth_token = authService.token;
    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.allData = resp ?? [];
      this.tableComponent.initTable(this.allData);

    });
  }

  ngOnInit(){

  }

  create(data: any){
    this.crudService.create(data)
    .subscribe(
      (resp) => {
        console.log(resp);
        if(!resp?.error){
          this.allData.push(resp);
          console.log(this.allData, 2);
          this.tableComponent.initTable(this.allData);
          this.toastService.show({ message: 'Administrador creado con exito', classname: 'bg-success text-dark'});
        }
      }
    )
  }

  edit(data: any){
    this.crudService.update(data, data.id)
    .subscribe(
      (resp) => {
        if(!resp?.error){
          this.allData = this.allData.map(item => (item.id == data.id)? data : item);
          this.tableComponent.initTable(this.allData);
          this.toastService.show({ message: 'Administrador editado con exito', classname: 'bg-success text-dark'});
        }
      }
    )
  }

  delete(id: any){
    this.crudService.delete(id)
    .subscribe(
      (resp) => {
        console.log(resp);
        if(!resp?.error){
          this.allData = this.allData.filter((item) => item.id != id);
          console.log(this.allData);
          this.tableComponent.initTable(this.allData);
          this.toastService.show({ message: 'Administrador eliminado con exito', classname: 'bg-success text-dark'});

        }
      }
    )
  }
}
