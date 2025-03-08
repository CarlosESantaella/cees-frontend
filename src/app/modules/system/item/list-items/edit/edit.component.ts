import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
    selector: 'app-edit',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
  // @Input() name: string = '';
  rates: any[] = [];
  form!: FormGroup;
  currency: string = '';

  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  @ViewChildren('file_input') file_inputs!: QueryList<ElementRef>;
  @ViewChild('created_at_form') created_at_form!: ElementRef;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) // public datePipe: DatePipe
  {}

  ngOnInit() {
    console.log(this.data.created_at);

    // let client_id: number = parseInt(this.data.client_id, 10);
    this.form = this.fb.group({
      description: [this.data.description ?? '', [Validators.required]],
      unit_of_measurement: [this.data.unit_of_measurement ?? '', [Validators.required]],
      gross_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      indirect_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      utility: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      total_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      initial_description: [this.data.initial_description ?? '', [Validators.required]],
      final_description: [this.data.final_description ?? '', [Validators.required]],
      rate_id: [this.data.rate_id ?? '', [Validators.required]],
    });
    // this.created_at?.setValue(full_date);
    this.crudService.api_path_list = '/rates';
    this.crudService.api_path_show = '/configurations';
    this.crudService.auth_token = this.authService.token;

    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      this.rates = resp ?? [];
      // this.client_id?.setValue(this.data.id);
    });

    this.crudService.show('').subscribe((resp: any) => {
      this.currency = resp.currency;
    });
  }

  ngAfterViewInit() {
    // const parsedDate = new Date(this.data.created_at);
    // const year = parsedDate.getFullYear();
    // const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    // const day = parsedDate.getDate().toString().padStart(2, '0');
    // let full_date: any = `${day}-${month}-${year}`;
    // this.created_at_form.nativeElement.value = full_date;
  }

  get description() {
    return this.form.get('description');
  }
  get unit_of_measurement() {
    return this.form.get('unit_of_measurement');
  }
  get gross_cost() {
    return this.form.get('gross_cost');
  }
  get indirect_cost() {
    return this.form.get('indirect_cost');
  }
  get utility() {
    return this.form.get('utility');
  }
  get total_cost() {
    return this.form.get('total_cost');
  }
  get initial_description() {
    return this.form.get('initial_description');
  }
  get final_description() {
    return this.form.get('final_description');
  }
  get rate_id() {
    return this.form.get('rate_id');
  }

  totalCostCalculate(){
    let gross_cost = parseInt((this.gross_cost?.value == '')? 0 : this.gross_cost?.value);
    let indirect_cost = parseInt((this.indirect_cost?.value == '')? 0 : this.indirect_cost?.value);
    let utility = parseInt((this.utility?.value == '')? 0 : this.utility?.value);
    console.log(gross_cost, indirect_cost, utility);
    this.total_cost?.setValue(gross_cost+indirect_cost+utility);
  }

  onSubmit() {
    this.form.addControl('id', this.fb.control(this.data.id));
    const form_data = new FormData();


    this.editEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
