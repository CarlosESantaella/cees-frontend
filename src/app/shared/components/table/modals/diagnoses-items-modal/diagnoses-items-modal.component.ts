import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CrudService } from '../../../../services/crud.service';
import { ToastService } from '../../../../services/toast.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-diagnoses-items-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, TableModule, ButtonModule, InputTextModule],
  templateUrl: './diagnoses-items-modal.component.html',
  styleUrl: './diagnoses-items-modal.component.css'
})
export class DiagnosesItemsModalComponent implements AfterViewInit {
  @Input() diagnosis_id_selected: number = 0;
  @Input() actions: any[] = [];
  @ViewChild('dt') dt!: Table;

  visibleDiagnosticItems: boolean = false;
  all_items: any = [];
  items_to_send: any = [];
  diagnostic_items: any = {};

  private crudService = inject(CrudService);
  private toastService = inject(ToastService);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('hola mundo', this.actions[0].name);
    if(this.actions[0].name == 'Diagnostico'){
      this.crudService.get(`/items`).subscribe((resp: any) => {
        this.all_items = resp;
        console.log('items: ', this.all_items);
        this.all_items.forEach((item: any) => {
          this.diagnostic_items['item_id_' + item.id] = 0;
        });
      });
    }
  }

  ngAfterViewInit() {
    // Ensure dt reference is available
    if (!this.dt) {
      console.error('Table reference (dt) is not available.');
    }
  }

  showDialogDiagnosesItems(diagnosis_id: number) {
    this.diagnosis_id_selected = diagnosis_id;
    this.visibleDiagnosticItems = true;
    this.crudService
      .get(`/diagnoses/${this.diagnosis_id_selected}/items`)
      .subscribe((response: any) => {
        this.items_to_send = [];

        let response_items = response;
        for (let key in this.diagnostic_items) {
          if (this.diagnostic_items.hasOwnProperty(key)) {
            this.diagnostic_items[key] = 0;
          }
        }
        response_items.forEach((response_item: any) => {
          this.diagnostic_items['item_id_' + response_item.item_id] =
            response_item.quantity;
          this.items_to_send.push(response_item.item);
        });
        this.cdr.detectChanges();
      });
  }

  onClickAddItem(item: any) {
    let hasItem = this.items_to_send.find(
      (itemToFind: any) => itemToFind.id == item.id
    );
    if (!hasItem) {
      this.items_to_send.push(item);
      this.diagnostic_items['item_id_' + item.id] = 0;
    }
    console.log(this.items_to_send);

    console.log('resultado items: ', this.diagnostic_items);
  }

  onClickRemoveItem(item: any) {
    this.items_to_send = this.items_to_send.filter((itemToFilter: any) => {
      return itemToFilter.id != item.id;
    });
    let keyToDelete = 'item_id_' + item.id;
    if (keyToDelete in this.diagnostic_items) {
      delete this.diagnostic_items[keyToDelete];
      console.log('resultado items: ', this.diagnostic_items);
    }
  }

  updateDiagnosticItems() {
    let items_to_upload: any = {
      items: [],
    };

    for (let key in this.diagnostic_items) {
      if (this.diagnostic_items.hasOwnProperty(key)) {
        if (this.diagnostic_items[key] > 0) {
          let item_array: any = key.split('_');
          items_to_upload.items.push({
            diagnoses_id: this.diagnosis_id_selected,
            item_id: item_array[2],
            quantity: this.diagnostic_items[key],
          });
        }
      }
    }

    this.crudService
      .put(`/diagnoses/${this.diagnosis_id_selected}/items`, items_to_upload)
      .subscribe((response: any) => {
        this.visibleDiagnosticItems = false;
        this.toastService.show({
          message: 'Items asociados al diagnostico actualizados con exito',
          classname: 'bg-success text-white',
        });
      });
  }

  onInputSearchItems(event: any) {
    const inputElement = event.target as HTMLInputElement;
    setTimeout(() => {
      if (this.dt && this.dt.filterGlobal) {
        this.dt.filterGlobal(inputElement.value, 'contains');
      } else {
        console.error('Table reference (dt) is not available or filterGlobal is not a function.');
      }
    }, 0);
  }

  closeDialog() {
    this.visibleDiagnosticItems = false;
  }
}
