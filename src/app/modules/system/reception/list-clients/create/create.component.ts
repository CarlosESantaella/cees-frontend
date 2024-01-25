import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();


  form: FormGroup;
  constructor(
    public modal:NgbActiveModal,
    public fb: FormBuilder
  ){
    this.form = this.fb.group({
      full_name: ['', Validators.required],
      address: ['', Validators.required],
      cellphone: ['', Validators.required],
      identification: ['', Validators.required],
      contact: ['', Validators.required],
      cell: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.required],
      comments: ['', Validators.required],
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
    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
