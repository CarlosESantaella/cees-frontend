import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CrudService } from '../../../../../shared/services/crud.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoComplete } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoComplete
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  @Input() all_permissions: any = [];
  @Output() createEvent: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    private toastService: ToastService,
    public modal: NgbActiveModal,
  ) { }

  get username() {
    return this.form.get('username');
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.crudService.api_path_list = '/users/without-profile';


    this.crudService.list().subscribe((resp) => {
      // this.allData = resp;
      this.users = resp;
      console.log('this.users', this.users);

    });
  }

  search(event: AutoCompleteCompleteEvent) {
    // this.items = [...Array(10).keys()].map(item => event.query + '-' + item);
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(event.query.toLowerCase()));
  }

  onUserSelect(event: any) {
    // Extrae solo la propiedad 'username' del objeto seleccionado
    console.log(event);
    const selectedUsername = event?.value?.username;
    this.form.get('username')?.setValue(selectedUsername);
  }

  onSubmit() {
    this.createEvent.emit(this.form.value);
    this.modal.dismiss();
  }
}
