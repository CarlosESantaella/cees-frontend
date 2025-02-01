import {
  AsyncPipe,
  CommonModule,
  DecimalPipe,
  formatDate,
} from '@angular/common';
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
import { format, parse, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
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
import { CreateComponent as CreateDiagnosesComponent } from '../../../modules/system/diagnoses/list-diagnoses/create/create.component';
import { CreateComponent as CreateFeilureModeComponent } from '../../../modules/system/diagnoses/list-failure-modes/create/create.component';
// Edit something
import { EditComponent as EditUserComponent } from '../../../modules/system/access/list-users/edit/edit.component';
import { EditComponent as EditClientComponent } from '../../../modules/system/reception/list-clients/edit/edit.component';
import { EditComponent as EditRolComponent } from '../../../modules/system/access/list-rols/edit/edit.component';
import { EditComponent as EditAdminComponent } from '../../../modules/system/admin/edit/edit.component';
import { EditComponent as EditReceptionComponent } from '../../../modules/system/reception/list-receptions/edit/edit.component';
import { EditComponent as EditRateComponent } from '../../../modules/system/item/list-rates/edit/edit.component';
import { EditComponent as EditItemComponent } from '../../../modules/system/item/list-items/edit/edit.component';
import { EditComponent as EditDiagnosesComponent } from '../../../modules/system/diagnoses/list-diagnoses/edit/edit.component';
import { EditComponent as EditFailureModeComponent } from '../../../modules/system/diagnoses/list-failure-modes/edit/edit.component';

//others
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

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
import { ToastService } from '../../services/toast.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { InputSwitchModule } from 'primeng/inputswitch';
import { es } from 'date-fns/locale';
import { DiagnosisFilesModalComponent } from './modals/diagnosis-files-modal/diagnosis-files-modal.component';
import { FailureModeModalComponent } from './modals/failure-mode-modal/failure-mode-modal.component';
import { DiagnosesItemsModalComponent } from './modals/diagnoses-items-modal/diagnoses-items-modal.component';

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
    FieldsetModule,
    InputSwitchModule,
    SafeHtmlPipe,
    DialogModule,
    TableModule,
    DiagnosisFilesModalComponent,
    FailureModeModalComponent,
    DiagnosesItemsModalComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [TableService, DecimalPipe, SafeHtmlPipe],
})
export class TableComponent {
  @ViewChild('dt') dt: any;

  // data$: Observable<any[]>;
  // total$: Observable<number>;
  data$: Observable<any[]> = new BehaviorSubject<any[]>([]);
  total$: Observable<number> = new BehaviorSubject<number>(0);

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() aditionalData: any = {};
  @Input() actions: any[] = [];
  @Input() clients: any[] = [];
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() sendMailEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();
  @Output() setIndexReceptionsEvent = new EventEmitter<any>();

  @ViewChildren(TableSortableDirective)
  headers!: QueryList<TableSortableDirective>;
  @ViewChild('number_reception')
  number_reception!: ElementRef;
  @ViewChildren('file_input_diagnostic_photo')
  file_inputs_diagnostic_photos!: QueryList<ElementRef>;
  @ViewChild(DiagnosisFilesModalComponent) diagnosisFilesModal!: DiagnosisFilesModalComponent;
  @ViewChild(FailureModeModalComponent) failureModeModal!: FailureModeModalComponent;
  @ViewChild(DiagnosesItemsModalComponent) diagnosesItemsModal!: DiagnosesItemsModalComponent;

  n_actions: number = 0;
  crudService!: any;
  toastService!: any;
  number_reception_disabled: boolean = false;
  names_clients: string = '';
  custom_currency: string = '';
  // date: Date | undefined;
  date: any;
  client_selected: any = [];
  clients_all: any = [];

  status_switches: any = {};

  //modals
  selectedReceptionId: number | null = null;
  visibleDiagnosisFiles: boolean = false;
  diagnosis_files_selected: any = {};
  diagnosis_id_selected: number = 0;

  visibleFailureMode: boolean = false;
  failure_mode_selected: number | string = '';
  all_failure_modes: any = [];

  visibleDiagnosticItems: boolean = false;
  all_items: any = [];
  items_to_send: any = [];
  diagnostic_items: any = {};

  visibleDiagnosticItemPhotos: boolean = false;
  diagnostic_items_to_photos: number[] = [];
  diagnostic_photos_to_items: any[] = [];
  diagnostic_photos_data: any[] = [];
  all_diagnostic_photos_items: any = [];

  constructor(
    public ngbModal: NgbModal,
    public dialog: MatDialog,
    public service: TableService,
    public authService: AuthService,
    public http: HttpClient,
    public fb: FormBuilder
  ) {
    this.crudService = inject(CrudService);
    this.toastService = inject(ToastService);
  }

  ngOnInit() {
    if (this.actions[0].name == 'Recepcion') {
      this.crudService.api_path_show = '/configurations';

      this.crudService.show('').subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.custom_currency = resp.currency;

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

    if (this.actions[0].name == 'Diagnostico') {
      this.crudService.api_path_list = '/failure-modes';

      this.crudService.get(`/failure-modes`).subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.all_failure_modes = resp;
        if (this.all_failure_modes.length > 0) {
          this.failure_mode_selected = this.all_failure_modes[0].id;
        }
        console.log('failure modes', resp);
      });

      this.crudService.get(`/items`).subscribe((resp: any) => {
        // this.tableService.DATA = resp;
        this.all_items = resp;
        this.all_items.forEach((item: any) => {
          this.diagnostic_items['item_id_' + item.id] = 0;
        });
        console.log('all items', this.all_items);
        console.log('this.diagnostic_items', this.diagnostic_items);
      });
    }
    if (this.aditionalData?.receptionId) {
      this.selectedReceptionId = this.aditionalData?.receptionId;
    }
    this.initTable(this.data);
    console.log('this.data', this.data);

    if (this.actions[0].name == 'Diagnostico') {
      this.data$.subscribe((data: any) => {
        data.forEach((diagnosis: any) => {
          this.status_switches['id_' + diagnosis['id']] =
            diagnosis['status'] == 1 ? true : false;
        });
      });
    }
  }

  onInputSearchItems(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.dt.filterGlobal(inputElement.value, 'contains');
  }

  validateImgFile(index: number): boolean {
    if (this.diagnostic_photos_to_items[index] == null) {
      return false;
    } else {
      return true;
    }
  }

  handleFileInputImg(event: any, i: any) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    if (files.length > 0) {
      let validate_file = this.validateImageType(file);
      if (validate_file) {
        if (file) this.readFile(file, i);
      } else {
        event.target.value = null;
      }
    }
  }

  readFile(file: File, i: any) {
    const reader = new FileReader();

    reader.onloadend = () => {
      let preview = reader.result as string;
      let input = document.querySelector('#img-file-' + i) as HTMLInputElement;
      input.src = preview;
    };
    reader.readAsDataURL(file);
  }

  validateImageType(file: File): boolean {
    const tipoPermitido = ['image/jpeg', 'image/png', 'image/gif']; // Ajusta según tus necesidades
    return tipoPermitido.includes(file.type);
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

  public initTable(data: any) {
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
      case 'Diagnostico':
        const modalRefDiagnoses = this.ngbModal.open(EditDiagnosesComponent, {
          centered: true,
          size: 'lg',
        });
        modalRefDiagnoses.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefDiagnoses.componentInstance.editEvent.subscribe((resp: any) => {
          this.editEvent.emit(resp);
        });
        break;
      case 'Modo de falla':
        const modalRefFailureMode = this.ngbModal.open(
          EditFailureModeComponent,
          {
            centered: true,
            size: 'lg',
          }
        );
        // console.log(id, 'id');
        // console.log(this.data.filter((row) => row.id == id)[0], 'data');
        modalRefFailureMode.componentInstance.data = this.data.filter(
          (row) => row.id == id
        )[0];
        modalRefFailureMode.componentInstance.editEvent.subscribe(
          (resp: any) => {
            this.editEvent.emit(resp);
          }
        );
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

  exportPdf(name: string, id: any) {
    switch (name) {
      case 'Recepcion':
        const token = this.authService.token;

        window.open(
          `${environment.api_web}/receptions/${id}/pdf?token=${token}`
        );
        break;
    }
  }

  exportExcel() {
    switch (this.actions[0].name) {
      case 'Recepcion':
        const token = this.authService.token;
        let query_params = '?token=' + token;
        let start_date = '';
        let end_date = '';
        let counter = 0;
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

  sendMail(name: string, id: any) {
    switch (name) {
      case 'Recepcion':
        const token = this.authService.token;
        this.dialog
          .open(ConfirmationDialog, {
            data: {
              title: 'Enviar Email',
              message:
                '¿Seguro deseas enviar reporte al cliente de esta recepción?',
            },
          })
          .afterClosed()
          .subscribe((confirmado: boolean) => {
            if (confirmado) {
              this.sendMailEvent.emit(id);
            }
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
      this.initTable(this.data);
    });
  }

  changeStatusSwitch(status_switch: boolean | number, diagnosis_id: number) {
    status_switch = status_switch ? 1 : 0;
    this.crudService
      .patch(`/diagnoses/${diagnosis_id}/status/${status_switch}`, {})
      .subscribe((response: any) => {
        if (response.status) {
          this.data[0].initial_date = response.initial_date;
        }
      });
  }

  showDialogDiagnosesItems(diagnosis_id: number) {
    this.diagnosesItemsModal.showDialogDiagnosesItems(diagnosis_id);
  }

  updateDiagnosticItemPhotos() {
    let form_data: any = new FormData();
    this.file_inputs_diagnostic_photos.forEach((item, i) => {
      var file: any = item.nativeElement as HTMLInputElement;

      if (file.files && file.files.length > 0) {
        console.log('hola mund 1');
        let file_aux: any = file?.files[0];
        form_data.append(`photo_` + i, file_aux);
      } else {
        form_data.append(
          `photo_` + i,
          this.diagnostic_photos_to_items[i] ?? false
        );
      }
    });

    for (let pair of form_data.entries()) {
      console.log('formData', pair[0] + ':', pair[1]);
    }

    this.diagnostic_items_to_photos.forEach((diagnostic_item_to_photo: any) => {
      form_data.append(`items[]`, diagnostic_item_to_photo);
    });

    this.crudService
      .post(`/diagnoses/${this.diagnosis_id_selected}/items/photos`, form_data)
      .subscribe((response: any) => {
        console.log('response photos', response);
        this.visibleDiagnosticItemPhotos = false;
        this.toastService.show({
          message:
            'Fotos de items asociados al diagnostico actualizados con exito',
          classname: 'bg-success text-dark',
        });
      });
  }

  showDialogDiagnosesItemPhotos(diagnosis_id: number) {
    this.diagnosis_id_selected = diagnosis_id;
    this.visibleDiagnosticItemPhotos = true;
    this.diagnostic_items_to_photos = [];
    this.diagnostic_photos_to_items = [];

    this.crudService
      .get(`/diagnoses/${this.diagnosis_id_selected}/items`)
      .subscribe((items_response: any) => {
        this.all_diagnostic_photos_items = items_response;
        items_response.forEach((item_response: any) => {
          this.diagnostic_items_to_photos.push(item_response.item_id);
        });
        this.crudService
          .get(`/diagnoses/${this.diagnosis_id_selected}/items/photos`)
          .subscribe((items_photos_response: any) => {
            this.diagnostic_items_to_photos.forEach(
              (diagnostic_item_to_photo: any) => {
                let photo = items_photos_response.find(
                  (item_photo_response: any) => {
                    return (
                      item_photo_response.item_id == diagnostic_item_to_photo
                    );
                  }
                );

                if (photo) {
                  this.diagnostic_photos_to_items.push(photo.photo);
                } else {
                  this.diagnostic_photos_to_items.push(null);
                }
              }
            );
          });
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
      if (pipe == 'date') {
        // const timeZone = 'America/Bogota';
        const craeted_at_date = parseISO(value);
        return format(craeted_at_date, 'dd-MM-yyyy hh:mm a', { locale: es });
      }
      if (pipe == 'datetime') {
        // const timeZone = 'America/Bogota';
        if(value){
          const craeted_at_date = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date());
          return format(craeted_at_date, 'dd-MM-yyyy hh:mm a', { locale: es });
        }
        return '';
      }
    } else {
      return value;
    }
  }
  getFormattedValueHTML(
    record: any,
    field: string,
    pipe: string | undefined
  ): any {
    var value = record[field];

    if (pipe) {
      if (pipe == 'status_switch') {
        value = value == 0 ? false : true;
        return `<input type="checkbox" checked="${value}"> hola`;
      }
      if (pipe == 'files_diagnoses') {
        value = value == 0 ? false : true;
        return `<input type="checkbox" checked="${value}"> hola`;
      }
    } else {
      return value;
    }
  }
}
