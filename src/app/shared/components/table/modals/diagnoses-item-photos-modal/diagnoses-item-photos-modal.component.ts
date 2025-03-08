import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CrudService } from '../../../../services/crud.service';
import { ToastService } from '../../../../services/toast.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-diagnoses-item-photos-modal',
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
    templateUrl: './diagnoses-item-photos-modal.component.html',
    styleUrl: './diagnoses-item-photos-modal.component.css'
})
export class DiagnosesItemPhotosModalComponent {
  @Input() diagnosis_id_selected: number = 0;
  @Output() visibleDiagnosticItemPhotosChange = new EventEmitter<boolean>();

  visibleDiagnosticItemPhotos: boolean = false;
  diagnostic_items_to_photos: number[] = [];
  diagnostic_photos_to_items: any[] = [];
  all_diagnostic_photos_items: any = [];
  @ViewChildren('file_input_diagnostic_photo') file_inputs_diagnostic_photos!: QueryList<ElementRef>;

  private crudService = inject(CrudService);
  private toastService = inject(ToastService);

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

  validateImgFile(index: number): boolean {
    if (this.diagnostic_photos_to_items[index] == null) {
      return false;
    } else {
      return true;
    }
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

  closeDialog() {
    this.visibleDiagnosticItemPhotos = false;
    this.visibleDiagnosticItemPhotosChange.emit(this.visibleDiagnosticItemPhotos);
  }
}
