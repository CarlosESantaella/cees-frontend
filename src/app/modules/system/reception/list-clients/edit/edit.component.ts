import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-edit-client',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
  // @Input() name: string = '';
  form!: FormGroup;
  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public modal:NgbActiveModal,
    public fb: FormBuilder
  ){}

  ngOnInit(){
    this.form = this.fb.group({
      full_name: [this.data.full_name ?? '', Validators.required],
      address: [this.data.address ?? '', Validators.required],
      cellphone: [this.data.cellphone ?? '', Validators.required],
      identification: [this.data.identification ?? '', Validators.required],
      contact: [this.data.contact ?? '', Validators.required],
      cell: [this.data.cell ?? '', Validators.required],
      city: [this.data.city ?? '', Validators.required],
      email: [this.data.email ?? '', Validators.required],
      comments: [this.data.comments ?? '', Validators.required],
    })
  }

  get full_name(){
    return this.form.get('full_name');
  }
  get cellphone(){
    return this.form.get('cellphone');
  }
  get address(){
    return this.form.get('address');
  }
  get identification(){
    return this.form.get('identification');
  }
  get contact(){
    return this.form.get('contact');
  }
  get cell(){
    return this.form.get('cell');
  }
  get city(){
    return this.form.get('city');
  }
  get email(){
    return this.form.get('email');
  }
  get comments(){
    return this.form.get('comments');
  }


  onSubmit(){
    this.form.addControl('id', this.fb.control(this.data.id));
    this.editEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
