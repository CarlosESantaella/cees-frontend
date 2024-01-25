import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren, Inject  } from '@angular/core';
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
// Edit something
import { EditComponent as EditUserComponent } from '../../../modules/system/access/list-users/edit/edit.component';
import { EditComponent as EditClientComponent } from '../../../modules/system/reception/list-clients/edit/edit.component';
import { EditComponent as EditRolComponent } from '../../../modules/system/access/list-rols/edit/edit.component';
import { EditComponent as EditAdminComponent } from '../../../modules/system/admin/edit/edit.component';
import { EditComponent as EditReceptionComponent } from '../../../modules/system/reception/list-receptions/edit/edit.component';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';

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
    MatButtonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [TableService, DecimalPipe]
})
export class TableComponent {
  // data$: Observable<any[]>;
  // total$: Observable<number>;
  data$: Observable<any[]> = new BehaviorSubject<any[]>([]);
  total$: Observable<number> = new BehaviorSubject<number>(0);
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() actions: any[] = [];
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();



  n_actions: number = 0;

  @ViewChildren(TableSortableDirective)
  headers!: QueryList<TableSortableDirective>;


  constructor(
    public ngbModal: NgbModal,
    public dialog: MatDialog,
    public service: TableService
  ) {}

  ngOnInit() {
    this.initTable(this.data);
  }

  initTable(data: any){
    this.data = data;
    this.service.DATA = data;
    this.service.initDataTable();
    this.data$ = this.service.data$;
    this.total$ = this.service.total$;
    this.n_actions = Object.keys(this.actions[0].actions).length;

    switch (this.actions[0].name) {
      case 'User':
        this.readActions();
        break;
      case 'Cliente':
        this.readActions();
        break;
    }
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
    }
  }

  openCreateModal(name: string) {
    switch (name) {
      case 'Administrador':
        const modalRefAdmin = this.ngbModal.open(CreateAdminComponent, {
          centered: true,
          size: 'md',
        });
        modalRefAdmin.componentInstance.createEvent.subscribe((resp:any)=> {
          this.createEvent.emit(resp);
        });
        break;
      case 'Cliente':
        const modalRefClient = this.ngbModal.open(CreateClientComponent, {
          centered: true,
          size: 'md',
        });
        modalRefClient.componentInstance.createEvent.subscribe((resp:any)=> {
          this.createEvent.emit(resp);
        });

        break;
      case 'Rol':
        const modalRefRol = this.ngbModal.open(CreateRolComponent, {
          centered: true,
          size: 'md',
        });
        modalRefRol.componentInstance.createEvent.subscribe((resp:any)=> {
          this.createEvent.emit(resp);
        });
        break;
      case 'Usuario':
        const modalRefUser = this.ngbModal.open(CreateUserComponent, {
          centered: true,
          size: 'md',
        });
        // modalRefUser.componentInstance.name = this.actions[0].name;
        modalRefUser.componentInstance.createEvent.subscribe((resp:any)=> {
          this.createEvent.emit(resp);
        });
        break;
      case 'Recepcion':
        const modalRefReception = this.ngbModal.open(CreateReceptionComponent, {
          centered: true,
          size: 'lg',
        });
        // modalRefReception.componentInstance.name = this.actions[0].name;
        modalRefReception.componentInstance.createEvent.subscribe((resp:any)=> {
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
        console.log(this.data,'1');

        modalRefAdmin.componentInstance.data = this.data.filter((row) => row.id == id)[0];
        modalRefAdmin.componentInstance.editEvent.subscribe((resp:any)=> {
          this.editEvent.emit(resp);
        });
        break;
      case 'Cliente':
        const modalRefClient = this.ngbModal.open(EditClientComponent, {
          centered: true,
          size: 'md',
        });
        modalRefClient.componentInstance.data = this.data.filter((row) => row.id == id)[0];
        console.log(this.data.filter((row) => row.id == id)[0]);
        modalRefClient.componentInstance.editEvent.subscribe((resp:any)=> {
          console.log(resp);
          this.editEvent.emit(resp);
        });
        break;
      case 'Rol':
        const modalRefRol = this.ngbModal.open(EditRolComponent, {
          centered: true,
          size: 'md',
        });
        modalRefRol.componentInstance.data = this.data.filter((row) => row.id == id)[0];
        modalRefRol.componentInstance.editEvent.subscribe((resp:any)=> {
          this.editEvent.emit(resp);
        });
        break;
      case 'Usuario':
        const modalRefUser = this.ngbModal.open(EditUserComponent, {
          centered: true,
          size: 'md',
        });
        modalRefUser.componentInstance.data = this.data.filter((row) => row.id == id)[0];
        modalRefUser.componentInstance.editEvent.subscribe((resp:any)=> {
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
        modalRefReception.componentInstance.data = this.data.filter((row) => row.id == id)[0];
        modalRefReception.componentInstance.editEvent.subscribe((resp:any)=> {
          this.editEvent.emit(resp);
        });
        break;
    }
  }
  
  openDeleteModal(name: string, id: any) {

        this.dialog
        .open(ConfirmationDialog, {
          data: {title: 'Eliminar', message: '¿Seguro deseas eliminar este '+name.toLowerCase()+'?'}
        })
        .afterClosed()
        .subscribe((confirmado: boolean) => {
          if (confirmado) {
            this.emitDeleteEvent(id);
          }
        });
  }

  emitDeleteEvent(id: any) {
    this.deleteEvent.emit(id);
  }

  readActions() {
    // for(property in this.actions[0].actions)
    // switch(this.actions[0].actions)
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
    const value = record[field];

    if (pipe) {
      // Aplicar la tubería si está presente
      // Asegúrate de importar la tubería necesaria en tu componente
      if (pipe == 'number') {
        return new DecimalPipe('en-US').transform(value);
      }
      if(pipe == 'img'){
        return `<img class="img-thumbnail" src="/assets/media/clients/${value}" width="70" />`;
      }
    }


    return value;
  }
}
