import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

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
      failure_mode: ['', Validators.required],
    });

  }

  get failure_mode() {
    return this.form.get('failure_mode');
  }



  onSubmit() {
    let form_values = this.form.value;
    const form_data = new FormData();
    const failure_mode: any = this.failure_mode?.value;

    form_data.append('failure_mode', failure_mode);

    this.createEvent.emit(form_data);
    this.modal.dismiss();
  }
}
