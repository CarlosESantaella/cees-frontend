import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  rates!: any[];
  currency: string = '';


  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService
  ) {
    crudService.api_path_list = '/rates';
    crudService.api_path_show = '/configurations';

    crudService.list().subscribe((resp) => {
      console.log(resp, 'rates');
      this.rates = resp;
      // this.selectedClients?.setValue(this.all_rols[0]?.id);
    });
    crudService.show('').subscribe((resp: any) => {
      this.currency = resp.currency;
    });
  }

  ngOnInit() {

    this.form = this.fb.group({
      description: ['', [Validators.required]],
      unit_of_measurement: ['', [Validators.required]],
      gross_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      indirect_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      utility: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      total_cost: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      initial_description: ['', [Validators.required]],
      final_description: ['', [Validators.required]],
      rate_id: ['', [Validators.required]],
    });
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

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl?.errors &&
        !matchingControl?.errors?.['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl?.value) {
        matchingControl?.setErrors({ confirmedValidator: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  totalCostCalculate(){
    let gross_cost = parseInt((this.gross_cost?.value == '')? 0 : this.gross_cost?.value);
    let indirect_cost = parseInt((this.indirect_cost?.value == '')? 0 : this.indirect_cost?.value);
    let utility = parseInt((this.utility?.value == '')? 0 : this.utility?.value);
    console.log(gross_cost, indirect_cost, utility);
    this.total_cost?.setValue(gross_cost+indirect_cost+utility);
  }

  onSubmit() {
    // let formData = new FormData();
    // let clients = this.form.value;
    // let clients_arr: any[] = [];

    // clients.selectedClients.forEach((item: any) => {
    //   clients_arr.push(item.id);
    // });

    // formData.append('clients', JSON.stringify(clients_arr));

    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
