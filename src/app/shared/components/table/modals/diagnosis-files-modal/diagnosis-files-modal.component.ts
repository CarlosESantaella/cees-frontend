import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CrudService } from '../../../../services/crud.service';
import { ToastService } from '../../../../services/toast.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-diagnosis-files-modal',
    imports: [CommonModule, ButtonModule, DialogModule],
    templateUrl: './diagnosis-files-modal.component.html',
    styleUrl: './diagnosis-files-modal.component.css'
})
export class DiagnosisFilesModalComponent {
  visibleDiagnosisFiles: boolean = false;
  @Input() diagnosis_id_selected: number = 0;
  // @Output() visibleDiagnosisFilesChange = new EventEmitter<boolean>();

  diagnosis_files_selected: any = {};

  private crudService = inject(CrudService);
  private toastService = inject(ToastService);

  handleDiagnosisFile(event: any) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.crudService
        .post(`/diagnoses/${this.diagnosis_id_selected}/upload-file`, formData)
        .subscribe((response: any) => {
          this.diagnosis_files_selected.push(response);
          target.value = '';
        });
    }
  }

  updateFileDianosis(event: any, file_id: number) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.crudService
        .deleteApi(`/diagnoses/${this.diagnosis_id_selected}/files/${file_id}`)
        .subscribe(() => {
          this.diagnosis_files_selected = this.diagnosis_files_selected.filter(
            (diagnosis_file: any) => diagnosis_file.id != file_id
          );
          this.crudService
            .post(
              `/diagnoses/${this.diagnosis_id_selected}/upload-file`,
              formData
            )
            .subscribe((response: any) => {
              this.diagnosis_files_selected.push(response);
              target.value = '';
            });
        });
    }
  }

  deleteFileDianosis(file_id: number) {
    this.crudService
      .deleteApi(`/diagnoses/${this.diagnosis_id_selected}/files/${file_id}`)
      .subscribe(() => {
        this.diagnosis_files_selected = this.diagnosis_files_selected.filter(
          (diagnosis_file: any) => diagnosis_file.id != file_id
        );
      });
  }

  showDialogFilesDianoses(diagnosis_id: number) {
    this.diagnosis_id_selected = diagnosis_id;
    this.visibleDiagnosisFiles = true;

    this.crudService
      .get(`/diagnoses/${this.diagnosis_id_selected}`)
      .subscribe((response: any) => {
        this.diagnosis_files_selected = response.files;
      });
  }

  closeDialog() {
    this.visibleDiagnosisFiles = false;
    // this.visibleDiagnosisFilesChange.emit(this.visibleDiagnosisFiles);
  }
}
