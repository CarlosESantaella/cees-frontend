import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CrudService } from '../../../../services/crud.service';
import { ToastService } from '../../../../services/toast.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-failure-mode-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './failure-mode-modal.component.html',
  styleUrl: './failure-mode-modal.component.css'
})
export class FailureModeModalComponent {
  visibleFailureMode: boolean = false;
  @Input() diagnosis_id_selected: number = 0;
  @Input() data: any[] = [];
  @Input() actions: any[] = [];
  @Input() diagnosis_files_selected: any[] = [];
  @Output() visibleFailureModeChange = new EventEmitter<boolean>();
  @Output() initTable = new EventEmitter<any[]>();

  failure_mode_selected: number | string = '';
  all_failure_modes: any = [];

  private crudService = inject(CrudService);
  private toastService = inject(ToastService);

  ngOnInit() {
    console.log('actions', this.actions);
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
    }
  }

  showDialogFailureMode(diagnosis_id: number) {
    this.diagnosis_id_selected = diagnosis_id;
    this.visibleFailureMode = true;

    this.crudService
      .get(`/diagnoses/${this.diagnosis_id_selected}`)
      .subscribe((response: any) => {
        console.log('response', response);
        this.diagnosis_files_selected = response.files;
      });


  }

  updateFailureMode() {
    let data = {
      failure_modes: [this.failure_mode_selected],
    };
    this.crudService
      .put(`/diagnoses/${this.diagnosis_id_selected}/failure-modes`, data)
      .subscribe((resp: any) => {
        this.data = this.data.map((response_data: any) => {
          if (this.diagnosis_id_selected == response_data.id) {
            if (
              response_data.failure_modes &&
              response_data.failure_modes.length > 0
            ) {
              response_data.failure_modes.splice(
                0,
                response_data.failure_modes.length
              );
            } else {
              response_data.failure_modes = [];
            }
            response_data.failure_modes.push(resp[0]);
          }
          return response_data;
        });
        this.initTable.emit(this.data);
        this.visibleFailureMode = false;
        this.toastService.show({
          message: 'Modo de falla actualizado con exito',
          classname: 'bg-success text-dark',
        });
        this.closeDialog();
      });
  }

  closeDialog() {
    this.visibleFailureMode = false;
    this.visibleFailureModeChange.emit(this.visibleFailureMode);
  }
}
