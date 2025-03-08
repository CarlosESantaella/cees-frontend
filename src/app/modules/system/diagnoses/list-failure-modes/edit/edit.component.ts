import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  receptions: any[] = [];
  form!: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit() {

    this.crudService.auth_token = this.authService.token;

    this.form = this.fb.group({
      failure_mode: [this.data.failure_mode ?? '', Validators.required],
    });

  }

  get failure_mode() {
    return this.form.get('failure_mode');
  }



  onSubmit() {
    let form_values = this.form.value;
    console.log('this.data.id', this.data.id);
    const form_data = new FormData();
    const failure_mode: any = this.failure_mode?.value;
    console.log('failure_mode', failure_mode);
    const id: any = this.failure_mode?.value;

    form_data.append('id', this.data.id);
    form_data.append('failure_mode', this.failure_mode?.value);


    this.editEvent.emit(form_data);
    this.modal.dismiss();
  }
}
