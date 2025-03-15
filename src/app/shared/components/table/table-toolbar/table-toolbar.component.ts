import { Component, Input, Output, EventEmitter, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '../../../services/table.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../../environments/environment.development';
import { CrudService } from '../../../services/crud.service';
import { TableActionsComponent } from '../table-actions/table-actions.component';
import { ActionsTableService } from '../table-actions/services/actions-table.service';
import { MatDialog } from '@angular/material/dialog';
//create components
import { CreateComponent as CreateReceptionComponent } from '../../../../modules/system/reception/list-receptions/create/create.component';
import { CreateComponent as CreateRateComponent } from '../../../../modules/system/item/list-rates/create/create.component';
import { CreateComponent as CreateItemComponent } from '../../../../modules/system/item/list-items/create/create.component';
import { CreateComponent as CreateDiagnosesComponent } from '../../../../modules/system/diagnoses/list-diagnoses/create/create.component';
import { CreateComponent as CreateFeilureModeComponent } from '../../../../modules/system/diagnoses/list-failure-modes/create/create.component';
import { CreateComponent as CreateUserComponent } from '../../../../modules/system/access/list-users/create/create.component';
import { CreateComponent as CreateClientComponent } from '../../../../modules/system/reception/list-clients/create/create.component';
import { CreateComponent as CreateRolComponent } from '../../../../modules/system/access/list-rols-v3/create/create.component';
import { CreateComponent as CreateAdminComponent } from '../../../../modules/system/admin/create/create.component';

@Component({
    selector: 'app-table-toolbar',
    imports: [CommonModule, FormsModule, CalendarModule, ButtonModule, NgbDropdownModule],
    templateUrl: './table-toolbar.component.html',
    styleUrl: './table-toolbar.component.css'
})
export class TableToolbarComponent {
  @ViewChild('number_reception')
  number_reception!: ElementRef;

  @Input() actions: any[] = [];
  @Input() clients_all: any[] = [];
  @Input() date: any;
  @Input() data: any;
  @Input() selectedReceptionId: any;

  @Input() client_selected: any;
  @Input() indexReception!: number;
  @Input() number_reception_disabled: boolean = false;
  @Output() dateChange = new EventEmitter<any>();
  @Output() client_selectedChange = new EventEmitter<any>();
  @Output() exportExcelEvent = new EventEmitter<void>();
  @Output() searchByDateAndClientEvent = new EventEmitter<any>();
  @Output() validateNumbersEvent = new EventEmitter<any>();
  @Output() submitIndexReceptionEvent = new EventEmitter<void>();
  @Output() initTable = new EventEmitter<any>();
  @Output() setIndexReceptionsEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();

  crudService!: any;
  isProcessing: boolean = false;

  constructor(
    public service: TableService,
    private ngbModal: NgbModal,
    public dialog: MatDialog,
    private authService: AuthService,
    private actionTableService: ActionsTableService
  ) {
    this.crudService = inject(CrudService);
  }

  ngOnInit() {
    console.log('actions toolbar', this.actions);
    if (this.actions.length > 0 && this.actions[0].name == 'Recepcion') {
      this.number_reception.nativeElement.value = this.indexReception;
    }
  }

  exportExcel() {
    switch (this.actions[0].name) {
      case 'Recepcion':
        const token = this.authService.token;
        let query_params = '?token=' + token;
        let start_date = '';
        let end_date = '';
        if (this.date?.length == 2) {
          this.date.forEach((item: any, index: number) => {
            let date_aux = new Date(item);
            let date_formated: any = formatDate(date_aux, 'yyyy-MM-dd', 'en');
            if (index == 0) {
              start_date = date_formated;
            } else {
              end_date = date_formated;
            }
          });
          query_params += '&start_date=' + start_date + '&end_date=' + end_date;
        }
        if (this.client_selected != '') {
          query_params += '&client_id=' + this.client_selected;
        }
        if (this.service.searchTerm.trim() != '') {
          query_params += '&search=' + this.service.searchTerm;
        }

        window.open(
          `${environment.api_web}/receptions/excel${query_params}`,
          '_blank'
        );
        break;
    }
  }

  searchByDateAndClient(event: any) {
    let data_to_send: any = new Object();
    let query_params = '';

    if (this.date?.length == 2) {
      this.date.forEach((item: any, index: number) => {
        let date_aux = new Date(item);
        let date_formated: any = formatDate(date_aux, 'yyyy-MM-dd', 'en');
        if (index == 0) {
          data_to_send.start_date = date_formated;
        } else {
          data_to_send.end_date = date_formated;
        }
      });
      query_params +=
        '?start_date=' +
        data_to_send.start_date +
        '&end_date=' +
        data_to_send.end_date;
    }

    if (this.client_selected != '') {
      data_to_send.client_id = this.client_selected;
      if (this.date?.length == 2) {
        query_params += '&client_id=' + this.client_selected;
      } else {
        query_params += '?client_id=' + this.client_selected;
      }
    }

    this.crudService.api_path_list = '/receptions' + query_params;

    this.crudService.list().subscribe((resp: any) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.data = resp ?? [];
      this.initTable.emit(this.data);

    });
  }

  actionModal($event: Event, action: string, id?: any) {
    switch (action) {
      case 'create':
        this.openCreateModal(this.actions[0]?.name);
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
        console.log('hola mundo bs');
        const modalRefClient = this.ngbModal.open(CreateClientComponent, {
          centered: true,
          size: 'md',
        });
        modalRefClient.componentInstance.createEvent.subscribe((resp: any) => {
          console.log('create client', resp);
          this.createEvent.emit(resp);
        });

        break;
      case 'Módulo':
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
        console.log('name from openCreateModal', name);

        const modalRefReception = this.ngbModal.open(CreateReceptionComponent, {
          centered: true,
          size: 'lg',
        });

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
      case 'Diagnostico':
        const modalRefDiagnoses = this.ngbModal.open(CreateDiagnosesComponent, {
          centered: true,
          size: 'lg',
        });
        // modalRefItem.componentInstance.name = this.actions[0].name;
        modalRefDiagnoses.componentInstance.receptionId =
          this.selectedReceptionId;
        console.log('selected reception id', this.selectedReceptionId);
        modalRefDiagnoses.componentInstance.createEvent.subscribe(
          (resp: any) => {
            this.createEvent.emit(resp);
          }
        );
        break;
      case 'Modo de falla':
        const modalRefFeilureMode = this.ngbModal.open(
          CreateFeilureModeComponent,
          {
            centered: true,
            size: 'lg',
          }
        );
        // modalRefItem.componentInstance.name = this.actions[0].name;
        modalRefFeilureMode.componentInstance.createEvent.subscribe(
          (resp: any) => {
            this.createEvent.emit(resp);
          }
        );
        break;
    }
  }
}
