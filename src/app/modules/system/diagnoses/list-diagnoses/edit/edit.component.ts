import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputSwitchModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  receptions: any[] = [];
  form!: FormGroup;

  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  @ViewChildren('file_input') file_inputs!: QueryList<ElementRef>;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    console.log('this.data', this.data);
    this.crudService.api_path_list = '/receptions';
    this.crudService.auth_token = this.authService.token;

    this.form = this.fb.group({
      reception_id: [this.data.reception_id ?? '', Validators.required],
      description: [this.data.description ?? '', Validators.required],
      observations: [this.data.observations ?? '', Validators.required],
      status: [(this.data.status == 1)? true : false, Validators.required],
    });

    this.crudService.list().subscribe((resp: any) => {
      // this.tableService.DATA = resp;
      console.log('resp', resp);
      this.receptions = resp ?? [];
      // this.reception_id?.setValue(this.receptions[0]?.id);
    });

  }

  get reception_id() {
    return this.form.get('reception_id');
  }
  get description() {
    return this.form.get('description');
  }
  get observations() {
    return this.form.get('observations');
  }
  get status() {
    return this.form.get('status');
  }


  onSubmit() {
    let form_values = this.form.value;
    const form_data = new FormData();
    const reception_id: any = this.reception_id?.value;
    const description: any = this.description?.value;
    const observations: any = this.observations?.value;
    let  status: any = this.status?.value;

    status = (status)? 1 : 0;
    form_data.append('id', this.data.id);
    form_data.append('reception_id', reception_id);
    form_data.append('description', description);
    form_data.append('observations', observations);
    form_data.append('status', status);

    let data = {
      id: this.data.id,
      reception_id: reception_id,
      description: description,
      observations: observations,
      status: status
    };

    this.editEvent.emit(data);
    this.modal.dismiss();
  }
}
