import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from 'primeng/table/table';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, ButtonModule, NgbDropdownModule],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.css'
})
export class TableToolbarComponent {
  @Input() actions: any[] = [];
  @Input() clients_all: any[] = [];
  @Input() date: any;
  @Output() dateChange = new EventEmitter<any>();
  @Input() client_selected: any;
  @Output() client_selectedChange = new EventEmitter<any>();
  @Input() number_reception_disabled: boolean = false;
  @Output() exportExcelEvent = new EventEmitter<void>();
  @Output() searchByDateAndClientEvent = new EventEmitter<any>();
  @Output() validateNumbersEvent = new EventEmitter<any>();
  @Output() submitIndexReceptionEvent = new EventEmitter<void>();
  @Output() actionModalEvent = new EventEmitter<{ event: Event, action: string }>();

  constructor(public service: TableService) {}

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  searchByDateAndClient(event: any) {
    this.searchByDateAndClientEvent.emit(event);
  }

  validateNumbers(event: any) {
    this.validateNumbersEvent.emit(event);
  }

  submitIndexReception() {
    this.submitIndexReceptionEvent.emit();
  }

  actionModal(event: Event, action: string) {
    this.actionModalEvent.emit({ event, action });
  }
}
