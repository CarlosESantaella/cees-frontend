import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

//edit components
import { EditComponent as EditReceptionComponent } from '../../../../modules/system/reception/list-receptions/edit/edit.component';
import { EditComponent as EditRateComponent } from '../../../../modules/system/item/list-rates/edit/edit.component';
import { EditComponent as EditItemComponent } from '../../../../modules/system/item/list-items/edit/edit.component';
import { EditComponent as EditDiagnosesComponent } from '../../../../modules/system/diagnoses/list-diagnoses/edit/edit.component';
import { EditComponent as EditFailureModeComponent } from '../../../../modules/system/diagnoses/list-failure-modes/edit/edit.component';
import { EditComponent as EditUserComponent } from '../../../../modules/system/access/list-users/edit/edit.component';
import { EditComponent as EditClientComponent } from '../../../../modules/system/reception/list-clients/edit/edit.component';
import { EditComponent as EditRolComponent } from '../../../../modules/system/access/list-rols-v2/edit/edit.component';
import { EditComponent as EditAdminComponent } from '../../../../modules/system/admin/edit/edit.component';
//services
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog.component';
import {
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../../environments/environment.development';
import { debounceTime, filter, Subject, Subscription, take, takeUntil } from 'rxjs';
import { ActionsTableService } from './services/actions-table.service';
@Component({
    selector: 'app-table-actions',
    imports: [
        CommonModule,
        NgbDropdownModule
    ],
    templateUrl: './table-actions.component.html',
    styleUrl: './table-actions.component.css'
})
export class TableActionsComponent {
  private isProcessing: boolean = false;
  private destroy$ = new Subject<void>();
  
  @Input() actions: any[] = [];
  @Input() visible: boolean = true;
  @Input() record: any;
  @Input() selectedReceptionId: number | null = null;
  @Input() data: any;
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() sendMailEvent = new EventEmitter<any>();

  constructor(
    private ngbModal: NgbModal,
    public dialog: MatDialog,
    public authService: AuthService,
  ) { 

  }

  ngOnInit() {
    
  }

  actionModal($event: Event, action: string, id?: any) {
    // $event.stopImmediatePropagation();


    switch (action) {
      case 'edit':
        this.openEditModal(this.actions[0]?.name, id);
        break;
      case 'delete':
        this.openDeleteModal(this.actions[0]?.name, id);
        break;
      case 'pdf':
        this.exportPdf(this.actions[0]?.name, id);
        break;
      case 'mail':
        this.sendMail(this.actions[0]?.name, id);
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
        )[0];
        console.log(this.data.filter((row: any) => row.id == id)[0]);
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          (row: any) => row.id == id
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
          this.deleteEvent.emit(id);
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
}
