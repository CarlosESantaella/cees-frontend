import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
    selector: 'app-create',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.css'
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
      initial_description: ['', [Validators.required]],
      final_description: ['', [Validators.required]],
      // rate_id: ['', [Validators.required]],
    });
  }

  get description() {
    return this.form.get('description');
  }
  get unit_of_measurement() {
    return this.form.get('unit_of_measurement');
  }
  get initial_description() {
    return this.form.get('initial_description');
  }
  get final_description() {
    return this.form.get('final_description');
  }
  // get rate_id() {
  //   return this.form.get('rate_id');
  // }

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
