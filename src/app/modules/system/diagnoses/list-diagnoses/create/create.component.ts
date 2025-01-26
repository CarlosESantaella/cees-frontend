import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';
import { TableComponent } from '../../../../../shared/components/table/table.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputSwitchModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  @Input('receptionId') receptionId!: any;
  @Output() createEvent: EventEmitter<any> = new EventEmitter();
  
  receptions: any[] = [];
  form!: FormGroup;
  
  @ViewChildren('file_input') file_inputs!: QueryList<ElementRef>;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.crudService.api_path_list = '/receptions';
    this.crudService.auth_token = this.authService.token;

    this.form = this.fb.group({
      reception_id: [this.receptionId ?? '', Validators.required],
      description: ['', Validators.required],
      observations: ['', Validators.required],
      status: [false, Validators.required],
    });

    this.crudService.list().subscribe((resp: any) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      if(resp.length > 0){
        this.receptions = resp.filter((reception: any) => reception.id == this.receptionId);
      }else{
        this.receptions = [];
      }
      this.reception_id?.setValue(this.receptions[0]?.id);
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

    form_data.append('reception_id', reception_id);
    form_data.append('description', description);
    form_data.append('observations', observations);
    form_data.append('status', status);


    console.log(form_data, 'form dataaas');

    this.createEvent.emit(form_data);
    this.modal.dismiss();
  }

}
