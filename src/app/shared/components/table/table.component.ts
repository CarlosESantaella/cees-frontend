import {
  AsyncPipe,
  CommonModule,
  DecimalPipe,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { format, parse, parseISO } from 'date-fns';
import {
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import {
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import {
  SortEvent,
  TableSortableDirective,
} from '../../directives/table-sortable.directive';
import { TableService } from '../../services/table.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

//others
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import {
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
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
import { DiagnosesItemPhotosModalComponent } from './modals/diagnoses-item-photos-modal/diagnoses-item-photos-modal.component';
import { TableToolbarComponent } from './table-toolbar/table-toolbar.component';
import { TableActionsComponent } from './table-actions/table-actions.component';
import { ButtonModule } from 'primeng/button';

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
    DiagnosesItemPhotosModalComponent,
    TableToolbarComponent,
    TableActionsComponent,
    ButtonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [TableService, DecimalPipe, SafeHtmlPipe],
})
export class TableComponent {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() aditionalData: any = {};
  @Input() actions: any[] = [];
  @Input() clients: any[] = [];
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() sendMailEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<any>();
  @Output() actionModalEvent = new EventEmitter<{ event: Event, action: string, id: any }>();

  @ViewChildren(TableSortableDirective)
  headers!: QueryList<TableSortableDirective>;

  @ViewChildren('file_input_diagnostic_photo')
  file_inputs_diagnostic_photos!: QueryList<ElementRef>;
  @ViewChild(DiagnosisFilesModalComponent) diagnosisFilesModal!: DiagnosisFilesModalComponent;
  @ViewChild(FailureModeModalComponent) failureModeModal!: FailureModeModalComponent;
  @ViewChild(DiagnosesItemsModalComponent) diagnosesItemsModal!: DiagnosesItemsModalComponent;
  @ViewChild(DiagnosesItemPhotosModalComponent) diagnosesItemPhotosModal!: DiagnosesItemPhotosModalComponent;
  @ViewChild(TableToolbarComponent) tableToolbar!: TableToolbarComponent;

  data$: Observable<any[]> = new BehaviorSubject<any[]>([]);
  total$: Observable<number> = new BehaviorSubject<number>(0);

  n_actions: number = 0;
  crudService!: any;
  indexReception: number = 0;
  toastService!: any;
  number_reception_disabled: boolean = false;
  names_clients: string = '';
  custom_currency: string = '';
  // date: Date | undefined;
  date: any;
  client_selected: any = [];
  clients_all: any = [];

  status_switches: any = {};
  permission_switches: any = {};

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
    console.log('this.actions', this.actions);
    if (this.actions[0].name == 'Recepcion') {
      this.crudService.api_path_show = '/configurations';

      this.crudService.show('').subscribe((resp: any) => {
        this.custom_currency = resp.currency;

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


    if (this.aditionalData?.receptionId) {
      this.selectedReceptionId = this.aditionalData?.receptionId;
    }
    console.log('this.data', this.data);
    this.initTable(this.data);

    if (this.actions[0].name == 'Diagnostico') {
      this.data$.subscribe((data: any) => {
        data.forEach((diagnosis: any) => {
          this.status_switches['id_' + diagnosis['id']] =
            diagnosis['status'] == 1 ? true : false;
        });
      });
    }
    if (this.actions[0].name == 'Rol') {
      this.initRolTable();
    }
  }

  async initRolTable() {
    this.crudService.api_path_list = '/permissions';
    let allPermissions: any = await firstValueFrom(this.crudService.list());
    allPermissions = Object.keys(allPermissions);
    this.data$.subscribe((data: any) => {
      data.forEach((rol: any) => {
        let rolPermissions = Object.keys(rol.permissions);
        this.validateRolPermissions(rol, rolPermissions);
      });
    });
  }

  validateRolPermissions(rol: any, rolPermissions: any) {
    if (rolPermissions.length > 0 && rolPermissions.includes('MANAGE CLIENTS') && rolPermissions.includes('MANAGE RATES') && rolPermissions.includes('MANAGE ITEMS')) {
      this.permission_switches['id_' + rol['id'] + '_' + 'service-management'] = true;
    } else {
      this.permission_switches['id_' + rol['id'] + '_' + 'service-management'] = false;
    }
    if (rolPermissions.length > 0 && rolPermissions.includes('MANAGE RECEPTIONS') && rolPermissions.includes('MANAGE DIAGNOSES') && rolPermissions.includes('MANAGE FAILURE MODES')) {
      this.permission_switches['id_' + rol['id'] + '_' + 'operations'] = true;
    } else {
      this.permission_switches['id_' + rol['id'] + '_' + 'operations'] = false;
    }
    if (rolPermissions.length > 0 && rolPermissions.includes('MANAGE RECEPTIONS')) {
      this.permission_switches['id_' + rol['id'] + '_' + 'document-management'] = true;
    } else {
      this.permission_switches['id_' + rol['id'] + '_' + 'document-management'] = false;
    }
    if (rolPermissions.length > 0 && rolPermissions.includes('MANAGE CONFIGURATIONS')) {
      this.permission_switches['id_' + rol['id'] + '_' + 'configurations'] = true;
    } else {
      this.permission_switches['id_' + rol['id'] + '_' + 'configurations'] = false;
    }
  }

  createAction(event: any) {
    console.log('createAction', event);
    this.createEvent.emit(event);
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

  public initTable(data: any) {
    this.data = data;
    this.service.DATA = data;
    this.service.initDataTable();
    this.data$ = this.service.data$;
    this.total$ = this.service.total$;
    this.n_actions = Object.keys(this.actions[0].actions).length;
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

  changePermissionSwitch(rol_id: number) {
    const data: any = new Object();
    data.permissions = data.permissions || {};

    if (this.permission_switches['id_' + rol_id + '_' + 'service-management']) {
      Object.assign(data.permissions, {
        'MANAGE CLIENTS': 'OWN',
        'MANAGE RATES': 'OWN',
        'MANAGE ITEMS': 'OWN'
      });
    }
    if (this.permission_switches['id_' + rol_id + '_' + 'operations']) {
      Object.assign(data.permissions, {
        'MANAGE RECEPTIONS': 'OWN',
        'MANAGE DIAGNOSES': 'OWN',
        'MANAGE FAILURE MODES': 'OWN'
      });
    }
    if (this.permission_switches['id_' + rol_id + '_' + 'document-management']) {
      Object.assign(data.permissions, {
        'MANAGE RECEPTIONS': 'OWN'
      });
    }
    if (this.permission_switches['id_' + rol_id + '_' + 'configurations']) {
      Object.assign(data.permissions, {
        'MANAGE CONFIGURATIONS': 'OWN'
      });
    }
    data.permissions = JSON.stringify(data.permissions);
    console.log('data', data);
    this.crudService
      .patch(`/profiles/${rol_id}`, data)
      .subscribe((response: any) => {
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
        if (value) {
          const craeted_at_date = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date());
          return format(craeted_at_date, 'dd-MM-yyyy hh:mm a', { locale: es });
        }
        return '';
      }
      if (pipe == 'permissions') {
        if (value) {
          return value + 'hola';
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
