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
  selector: 'app-rates-items-modal',
  imports: [CommonModule, FormsModule, DialogModule, TableModule, ButtonModule, InputTextModule],
  templateUrl: './rates-items-modal.component.html',
  styleUrl: './rates-items-modal.component.css'
})
export class RatesItemsModalComponent {
  @Input() rate_id_selected: number = 0;
  @Input() actions: any[] = [];
  @ViewChild('dt') dt!: Table;

  visibleRatesItems: boolean = false;
  all_items: any = [];
  items_to_send: any = [];
  rate_items: any = {};

  private crudService = inject(CrudService);
  private toastService = inject(ToastService);

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.actions[0].name == 'Tarifa') {
      this.crudService.get(`/items`).subscribe((resp: any) => {
        this.all_items = resp;
        console.log('items: ', this.all_items);
        this.all_items.forEach((item: any) => {
          this.rate_items['item_id_' + item.id] = 0;
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

  showDialogRatesItems(rate_id: number) {
    this.rate_id_selected = rate_id;
    this.visibleRatesItems = true;
    this.crudService
      .get(`/rates/${this.rate_id_selected}/items`)
      .subscribe((response: any) => {
        this.items_to_send = [];

        let response_items = response;
        for (let key in this.rate_items) {
          if (this.rate_items.hasOwnProperty(key)) {
            this.rate_items[key] = 0;
          }
        }
        response_items.forEach((response_item: any) => {
          this.rate_items['item_id_' + response_item.item_id] =
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
      this.rate_items['item_id_' + item.id] = 0;
    }
    console.log(this.items_to_send);

    console.log('resultado items: ', this.rate_items);
  }

  onClickRemoveItem(item: any) {
    this.items_to_send = this.items_to_send.filter((itemToFilter: any) => {
      return itemToFilter.id != item.id;
    });
    let keyToDelete = 'item_id_' + item.id;
    if (keyToDelete in this.rate_items) {
      delete this.rate_items[keyToDelete];
      console.log('resultado items: ', this.rate_items);
    }
  }

  updateRateItems() {
    let items_to_upload: any = {
      items: [],
    };
    console.log('this.rate_items', this.rate_items);
    for (let key in this.rate_items) {
      if (this.rate_items.hasOwnProperty(key)) {
        if (this.rate_items[key] > 0) {
          let item_array: any = key.split('_');
          items_to_upload.items.push({
            rate_id: this.rate_id_selected,
            item_id: item_array[2],
            quantity: this.rate_items[key],
          });
        }
      }
    }

    console.log('items_to_upload', items_to_upload);

    this.crudService
      .put(`/rates/${this.rate_id_selected}/items`, items_to_upload)
      .subscribe((response: any) => {
        console.log('response rates', response);
        this.visibleRatesItems = false;
        this.toastService.show({
          message: 'Items asociados a la tarifa actualizados con exito',
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
    this.visibleRatesItems = false;
  }
}
