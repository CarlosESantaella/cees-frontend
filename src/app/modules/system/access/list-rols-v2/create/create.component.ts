import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  @Input() all_permissions: any = [];
  @Output() createEvent: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private toastService: ToastService,
    public modal: NgbActiveModal,
  ) { }

  get name() {
    return this.form.get('name');
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
