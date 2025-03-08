import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-edit',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() data: any = null;
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
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
      name: [this.data.name || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    this.form.addControl('id', this.fb.control(this.data.id));
    this.editEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
