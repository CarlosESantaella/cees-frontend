import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { SidebarComponent } from '../../partials/sidebar/sidebar.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { CrudService } from '../../../../shared/services/crud.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-list-rates',
  imports: [HeaderComponent, FooterComponent, TableComponent],
  templateUrl: './list-rates.component.html',
  styleUrl: './list-rates.component.css'
})
export class ListRatesComponent {
  tableColumns: any[] = [
    { label: 'ID', field: 'id' },
    { label: 'Clientes', field: 'clients', pipe: 'extract_clients' },
    { label: 'Trabajo requerido', pipe: 'rates_items', html: true },
    { label: 'Costo bruto', field: 'gross_cost', pipe: 'custom_currency' },
    { label: 'Costo indirecto', field: 'indirect_cost', pipe: 'custom_currency' },
    { label: 'Utilidad', field: 'utility', pipe: 'custom_currency' },
    { label: 'Costo total', field: 'total_cost', pipe: 'custom_currency' }
  ];
  allData: any[] = [];

  actions: any[] = [
    {
      name: 'Tarifa',
      actions: {
        create: true,
        edit: true,
        delete: true,
      },
    },
  ];

  clients: any[] = [];

  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(
    public crudService: CrudService,
    public authService: AuthService,
    // public tableService: TableService,
    public toastService: ToastService
  ) {
    crudService.api_path_list = '/rates';
    crudService.api_path_show = '/rates/';
    crudService.api_path_create = '/rates';
    crudService.api_path_update = '/rates/';
    crudService.api_path_delete = '/rates/';

    crudService.auth_token = authService.token;
    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.allData = resp ?? [];
      this.tableComponent.initTable(this.allData);
    });
    crudService.api_path_list = '/clients';
    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      this.clients = resp;
    });
  }

  ngOnInit() { }

  create(data: any) {
    this.crudService.create(data).subscribe((resp) => {
      if (!resp?.error) {
        this.allData.push(resp);
        console.log(this.allData, 2);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Tarifa creada con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  edit(data: any) {
    this.crudService.update(data, data.id).subscribe((resp) => {
      console.log(resp, 233);
      if (!resp?.error) {
        this.allData = this.allData.map((item) =>
          item.id == data.id ? data : item
        );
        console.log(this.allData);
        this.tableComponent.initTable(this.allData);
        this.toastService.show({
          message: 'Tarifa editada con exito',
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
          message: 'Tarifa eliminada con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }
}
