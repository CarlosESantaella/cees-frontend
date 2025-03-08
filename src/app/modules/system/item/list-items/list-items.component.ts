import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
    selector: 'app-list-items',
    imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
    templateUrl: './list-items.component.html',
    styleUrl: './list-items.component.css'
})
export class ListItemsComponent {
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Descripción', field: 'description' },
    { label: 'Unidad de medida', field: 'unit_of_measurement' },
    { label: 'Costo bruto', field: 'gross_cost' , pipe: 'custom_currency'},
    { label: 'Costo indirecto', field: 'indirect_cost' , pipe: 'custom_currency'},
    { label: 'Utilidad', field: 'utility' , pipe: 'custom_currency'},
    { label: 'Costo total', field: 'total_cost' , pipe: 'custom_currency'},
    { label: 'Descripción inicial', field: 'initial_description' },
    { label: 'Descripción Final', field: 'final_description' },
  ];
  allData: any[] = [];

  actions: any[] = [
    {
      name: 'Item',
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
    crudService.api_path_list = '/items';
    crudService.api_path_show = '/items/';
    crudService.api_path_create = '/items';
    crudService.api_path_update = '/items/';
    crudService.api_path_delete = '/items/';

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
      if (!resp?.error) {
        this.allData.push(resp);
        console.log(this.allData, 2);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Item creado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    console.log(data, 'holasd d');
    this.crudService.update(data, data.id).subscribe((resp) => {
      console.log(resp, 233);
      if (!resp?.error) {
        this.allData = this.allData.map((item) =>
          item.id == data.id ? data : item
        );
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Item editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  delete(id: any) {
    this.crudService.delete(id).subscribe((resp) => {
      console.log(resp);
      if (!resp?.error) {
        this.allData = this.allData.filter((item) => item.id != id);
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Item eliminado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }
}
