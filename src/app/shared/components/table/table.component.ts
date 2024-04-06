import { AsyncPipe, CommonModule, DecimalPipe, formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  Inject,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  SortEvent,
  TableSortableDirective,
} from '../../directives/table-sortable.directive';
import { TableService } from '../../services/table.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
// Create something
import { CreateComponent as CreateUserComponent } from '../../../modules/system/access/list-users/create/create.component';
import { CreateComponent as CreateClientComponent } from '../../../modules/system/reception/list-clients/create/create.component';
import { CreateComponent as CreateRolComponent } from '../../../modules/system/access/list-rols/create/create.component';
import { CreateComponent as CreateAdminComponent } from '../../../modules/system/admin/create/create.component';
import { CreateComponent as CreateReceptionComponent } from '../../../modules/system/reception/list-receptions/create/create.component';
import { CreateComponent as CreateRateComponent } from '../../../modules/system/item/list-rates/create/create.component';
import { CreateComponent as CreateItemComponent } from '../../../modules/system/item/list-items/create/create.component';
// Edit something
import { EditComponent as EditUserComponent } from '../../../modules/system/access/list-users/edit/edit.component';
import { EditComponent as EditClientComponent } from '../../../modules/system/reception/list-clients/edit/edit.component';
import { EditComponent as EditRolComponent } from '../../../modules/system/access/list-rols/edit/edit.component';
import { EditComponent as EditAdminComponent } from '../../../modules/system/admin/edit/edit.component';
import { EditComponent as EditReceptionComponent } from '../../../modules/system/reception/list-receptions/edit/edit.component';
import { EditComponent as EditRateComponent } from '../../../modules/system/item/list-rates/edit/edit.component';
import { EditComponent as EditItemComponent } from '../../../modules/system/item/list-items/edit/edit.component';

//others
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { CrudService } from '../../services/crud.service';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'ngbd-table',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    TableSortableDirective,
    NgbPaginationModule,
    CommonModule,
    NgbDropdownModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CreateUserComponent,
    CreateClientComponent,
    CreateRolComponent,
    CreateAdminComponent,
    EditUserComponent,
    EditClientComponent,
    EditRolComponent,
    EditAdminComponent,
    MatButtonModule,
    CalendarModule,
    FieldsetModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [TableService, DecimalPipe],
})
export class TableComponent {
  // data$: Observable<any[]>;
  // total$: Observable<number>;
  data$: Observable<any[]> = new BehaviorSubject<any[]>([]);
  total$: Observable<number> = new BehaviorSubject<number>(0);



  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() actions: any[] = [];
  @Input() clients: any[] = [];
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();
  @Output() setIndexReceptionsEvent = new EventEmitter<any>();

  n_actions: number = 0;
  crudService!: any;
  number_reception_disabled: boolean = false;
  names_clients: string = '';
  custom_currency: string = '';
  // date: Date | undefined;
  date: any;
  client_selected: any = [];
  clients_all: any = [];

  @ViewChildren(TableSortableDirective)
  headers!: QueryList<TableSortableDirective>;
  @ViewChild('number_reception')
  number_reception!: ElementRef;

  constructor(
    public ngbModal: NgbModal,
    public dialog: MatDialog,
    public service: TableService,
    public authService: AuthService,
    public http: HttpClient
  ) {
    this.crudService = inject(CrudService);
  }

  ngOnInit() {
    if (this.actions[0].name == 'Recepcion') {
      this.crudService.api_path_show = '/configurations';

      this.crudService.show('').subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.custom_currency = resp.currency;
        console.log(resp, 'se cargo');
        if (resp.index_reception != null) {
          this.number_reception_disabled = true;
          this.number_reception.nativeElement.value = resp.index_reception;
        } else {
          this.number_reception_disabled = false;
        }
      });
      this.crudService.api_path_list = '/clients';
  
      this.crudService.list().subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.clients_all = resp ?? [];
        console.log(this.clients_all, 'clients_all');

      });
    }
    if (this.actions[0].name == 'Item') {
      this.crudService.api_path_show = '/configurations';

      this.crudService.show('').subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.custom_currency = resp.currency;
        console.log(resp, 'se cargo');
      });
    }

    this.initTable(this.data);
  }

  validateNumbers($event: any) {
    const input = $event.target;
    const valor = input.value;
    const regex = /^[0-9]+$/;
    if (!regex.test(valor)) {
      this.number_reception.nativeElement.value = '';
    }
  }
  submitIndexReception() {
    if (this.number_reception.nativeElement.value != '') {
      this.setIndexReceptionsEvent.emit(
        this.number_reception.nativeElement.value
      );
      this.number_reception_disabled = true;
    }
  }

  initTable(data: any) {
    this.data = data;
    this.service.DATA = data;
    this.service.initDataTable();
    this.data$ = this.service.data$;
    this.total$ = this.service.total$;
    this.n_actions = Object.keys(this.actions[0].actions).length;
  }

  actionModal($event: Event, action: string, id?: any) {
    $event.preventDefault();
    switch (action) {
      case 'create':
        this.openCreateModal(this.actions[0].name);
        break;
      case 'edit':
        this.openEditModal(this.actions[0].name, id);
        break;
      case 'delete':
        this.openDeleteModal(this.actions[0].name, id);
        break;
      case 'pdf':
        this.exportPdf(this.actions[0].name, id);
        break;
      case 'mail':
        this.sendMail(this.actions[0].name, id);
        break;
    }
  }

  openCreateModal(name: string) {
    switch (name) {
      case 'Administrador':
        const modalRefAdmin = this.ngbModal.open(CreateAdminComponent, {
          centered: true,
          size: 'md',
        });
        modalRefAdmin.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });
        break;
      case 'Cliente':
        const modalRefClient = this.ngbModal.open(CreateClientComponent, {
          centered: true,
          size: 'md',
        });
        modalRefClient.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });

        break;
      case 'Rol':
        const modalRefRol = this.ngbModal.open(CreateRolComponent, {
          centered: true,
          size: 'md',
        });
        modalRefRol.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });
        break;
      case 'Usuario':
        const modalRefUser = this.ngbModal.open(CreateUserComponent, {
          centered: true,
          size: 'md',
        });
        // modalRefUser.componentInstance.name = this.actions[0].name;
        modalRefUser.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });
        break;
      case 'Recepcion':
        const modalRefReception = this.ngbModal.open(CreateReceptionComponent, {
          centered: true,
          size: 'lg',
        });
        // modalRefReception.componentInstance.name = this.actions[0].name;
        modalRefReception.componentInstance.createEvent.subscribe(
          (resp: any) => {
            this.createEvent.emit(resp);
          }
        );
        break;
      case 'Tarifa':
        console.log('hola mundo bs');
        const modalRefRate = this.ngbModal.open(CreateRateComponent, {
          centered: true,
          size: 'lg',
        });
        // modalRefRate.componentInstance.name = this.actions[0].name;
        modalRefRate.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });
        break;
      case 'Item':
        console.log('hola mundo bs');
        const modalRefItem = this.ngbModal.open(CreateItemComponent, {
          centered: true,
          size: 'lg',
        });
        // modalRefItem.componentInstance.name = this.actions[0].name;
        modalRefItem.componentInstance.createEvent.subscribe((resp: any) => {
          this.createEvent.emit(resp);
        });
        break;
    }
  }

  openEditModal(name: string, id: any) {
    switch (name) {
      case 'Administrador':
        const modalRefAdmin = this.ngbModal.open(EditAdminComponent, {
          centered: true,
          size: 'md',
        });
        console.log(this.data, '1');

        modalRefAdmin.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefAdmin.componentInstance.editEvent.subscribe((resp: any) => {
          this.editEvent.emit(resp);
        });
        break;
      case 'Cliente':
        const modalRefClient = this.ngbModal.open(EditClientComponent, {
          centered: true,
          size: 'md',
        });
        modalRefClient.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        console.log(this.data.filter((row) => row.id == id)[0]);
        modalRefClient.componentInstance.editEvent.subscribe((resp: any) => {
          console.log(resp);
          this.editEvent.emit(resp);
        });
        break;
      case 'Rol':
        const modalRefRol = this.ngbModal.open(EditRolComponent, {
          centered: true,
          size: 'md',
        });
        modalRefRol.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefRol.componentInstance.editEvent.subscribe((resp: any) => {
          this.editEvent.emit(resp);
        });
        break;
      case 'Usuario':
        const modalRefUser = this.ngbModal.open(EditUserComponent, {
          centered: true,
          size: 'md',
        });
        modalRefUser.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefUser.componentInstance.editEvent.subscribe((resp: any) => {
          this.editEvent.emit(resp);
        });
        break;
      case 'Recepcion':
        const modalRefReception = this.ngbModal.open(EditReceptionComponent, {
          centered: true,
          size: 'lg',
        });
        // console.log(id, 'id');
        // console.log(this.data.filter((row) => row.id == id)[0], 'data');
        modalRefReception.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefReception.componentInstance.editEvent.subscribe((resp: any) => {
          this.editEvent.emit(resp);
        });
        break;
      case 'Tarifa':
        const modalRefRate = this.ngbModal.open(EditRateComponent, {
          centered: true,
          size: 'lg',
        });
        // console.log(id, 'id');
        // console.log(this.data.filter((row) => row.id == id)[0], 'data');
        modalRefRate.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefRate.componentInstance.editEvent.subscribe((resp: any) => {
          console.log('cerro');
          this.editEvent.emit(resp);
        });
        break;
      case 'Item':
        const modalRefItem = this.ngbModal.open(EditItemComponent, {
          centered: true,
          size: 'lg',
        });
        // console.log(id, 'id');
        // console.log(this.data.filter((row) => row.id == id)[0], 'data');
        modalRefItem.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefItem.componentInstance.editEvent.subscribe((resp: any) => {
          console.log('cerro');
          this.editEvent.emit(resp);
        });
        break;
    }
  }

  openDeleteModal(name: string, id: any) {
    this.dialog
      .open(ConfirmationDialog, {
        data: {
          title: 'Eliminar',
          message: '¿Seguro deseas eliminar este ' + name.toLowerCase() + '?',
        },
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.emitDeleteEvent(id);
        }
      });
  }

  exportPdf(name: string, id: any){
    switch (name) {
      case 'Recepcion':
        const token = this.authService.token;

        window.open(`${environment.api_web}/receptions/${id}/pdf?token=${token}`);
        break;
   
    }
  }

  exportExcel(){
    switch (this.actions[0].name) {
      case 'Recepcion':
        const token = this.authService.token;
        let query_params = '?token='+token;
        let start_date = '';
        let end_date = '';
        let counter = 0;
        if(this.date?.length == 2){
          this.date.forEach((item: any, index: number) => {
            let date_aux = new Date(item);
            let date_formated: any = formatDate(date_aux, 'yyyy-MM-dd', 'en');
            if(index == 0){
              start_date = date_formated;
            }else{
              end_date = date_formated;
            }

          });
          query_params += '&start_date='+start_date+'&end_date='+end_date;
        
        }
        if(this.client_selected != ''){
          query_params += '&client_id='+this.client_selected;

        }
        if(this.service.searchTerm.trim() != ''){
          query_params += '&search='+this.service.searchTerm;
        }

        

        window.open(`${environment.api_web}/receptions/excel${query_params}`, '_blank');
        break;
   
    }
    
  }

  sendMail(name: string, id: any){
    switch (name) {
      case 'Recepcion':

        const token = this.authService.token;

        // window.open(`${environment.api_web}/receptions/${id}/send-mail?token=${token}`);
        this.crudService.get(`/receptions/${id}/send-mail`).subscribe((response: any) => {
          console.log(response);
        });

        break;
   
    }
  }

  emitDeleteEvent(id: any) {
    this.deleteEvent.emit(id);
  }

  readActions() {
    // for(property in this.actions[0].actions)
    // switch(this.actions[0].actions)
  }
  searchByDateAndClient(event: any){
    let data_to_send:any = new Object();
    let query_params = '';

    if(this.date?.length == 2){
      this.date.forEach((item: any, index: number) => {
        let date_aux = new Date(item);
        let date_formated: any = formatDate(date_aux, 'yyyy-MM-dd', 'en');
        if(index == 0){
          data_to_send.start_date = date_formated;
        }else{
          data_to_send.end_date = date_formated;
        }

      });
      query_params += '?start_date='+data_to_send.start_date+'&end_date='+data_to_send.end_date;

    }
    
    if(this.client_selected != ''){
      data_to_send.client_id = this.client_selected;
      if(this.date?.length == 2){
        query_params += '&client_id='+this.client_selected;
      }else{
        query_params += '?client_id='+this.client_selected;
      }
    }

    this.crudService.api_path_list = '/receptions'+query_params;

    this.crudService.list().subscribe((resp: any) => { 
      // this.tableService.DATA = resp;
      console.log(resp);
      this.data = resp ?? [];
      this.initTable(this.data);
    });
    
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  // Propiedad computada para manejar la expresión con la tubería
  getFormattedValue(record: any, field: string, pipe: string | undefined): any {
    var value = record[field];

    if (pipe) {
      // Aplicar la tubería si está presente
      // Asegúrate de importar la tubería necesaria en tu componente
      if (pipe == 'number') {
        return new DecimalPipe('en-US').transform(value);
      }
      if (pipe == 'img') {
        return `<img class="img-thumbnail" src="/assets/media/clients/${value}" width="70" />`;
      }
      if (pipe == 'extract_clients') {
        console.log(this.clients);
        let clients_new = this.clients.filter((item) =>
          value.includes(item.id)
        );
        clients_new = clients_new.map((item) => {
          return item.full_name;
        });
        value = clients_new.join(', ');
        return value;
      }
      if (pipe == 'custom_currency') {
        console.log(this.custom_currency, 'hola mundo33');
        return value + this.custom_currency;
      }
    } else {
      return value;
    }
  }
}
