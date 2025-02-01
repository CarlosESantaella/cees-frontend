import { Component, Input, Output, EventEmitter, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '../../../services/table.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../../environments/environment.development';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
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

  @Input() client_selected: any;
  @Input() indexReception!: number;
  @Input() number_reception_disabled: boolean = false;
  @Output() dateChange = new EventEmitter<any>();
  @Output() client_selectedChange = new EventEmitter<any>();
  @Output() exportExcelEvent = new EventEmitter<void>();
  @Output() searchByDateAndClientEvent = new EventEmitter<any>();
  @Output() validateNumbersEvent = new EventEmitter<any>();
  @Output() submitIndexReceptionEvent = new EventEmitter<void>();
  @Output() actionModalEvent = new EventEmitter<{ event: Event, action: string }>();
  @Output() initTable = new EventEmitter<any>();
  @Output() setIndexReceptionsEvent = new EventEmitter<any>();
  crudService!: any;

  constructor(public service: TableService, private authService: AuthService) {
    this.crudService = inject(CrudService);
  }
  ngOnInit() {
    this.number_reception.nativeElement.value = this.indexReception;
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

  actionModal(event: Event, action: string) {
    this.actionModalEvent.emit({ event, action });
  }
}
