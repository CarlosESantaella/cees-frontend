import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../../../../shared/services/crud.service';
import { AuthService } from '../../../../../shared/services/auth.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  // @Input() name: string = '';
  @Output() createEvent: EventEmitter<any> = new EventEmitter();

  clients: any[] = [];
  form!: FormGroup;

  @ViewChildren('file_input') file_inputs!: QueryList<ElementRef>;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.crudService.api_path_list = '/clients';
    this.crudService.auth_token = this.authService.token;

    this.form = this.fb.group({
      // full_name: ['', Validators.required],
      client_id: ['', Validators.required],
      photos: this.fb.array([]),
      equipment_type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      serie: ['', Validators.required],
      capability: ['', Validators.required],
      comments: [''],
      // state: ['', Validators.required],
    });

    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      console.log(resp);
      this.clients = resp ?? [];
      this.client_id?.setValue(this.clients[0]?.id);
    });

    this.photos.push(this.newPhoto());
  }

  get client_id() {
    return this.form.get('client_id');
  }
  get equipment_type() {
    return this.form.get('equipment_type');
  }
  get brand() {
    return this.form.get('brand');
  }
  get model() {
    return this.form.get('model');
  }
  get serie() {
    return this.form.get('serie');
  }
  get capability() {
    return this.form.get('capability');
  }
  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }
  // get state() {
  //   return this.form.get('state');
  // }
  get comments() {
    return this.form.get('comments');
  }

  //manejo de agregar o quitar fotos
  addPhoto() {
    if (this.photos.controls.length >= 10) return;
    this.photos.push(this.newPhoto());
  }
  newPhoto(): FormGroup {
    return this.fb.group({
      photo: [null, [Validators.required]],
    });
  }
  removePhoto() {
    if (this.photos.controls.length <= 1) return;
    this.photos.removeAt(this.photos.length - 1);
  }

  //manejo del preview de las fotos
  handleFileInput(event: Event, i: any) {
    const target = event.target as HTMLInputElement;

    const files = target.files as FileList;

    const file = files[0];
    // if(file){
    //   // Actualizamos el valor del formulario
    //   this.photos.controls[i].get('photo')?.setValue(file);
    // }
    if (file) this.readFile(file, i);
  }

  readFile(file: File, i: any) {
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log(file, 'file hola mundo');

      let preview = reader.result as string;
      let input = document.querySelector('#img-file-' + i) as HTMLInputElement;
      input.src = preview;
    };
    reader.readAsDataURL(file);
  }
  // get comments(){
  //   return this.form.get('comments');
  // }
  // get state(){
  //   return this.form.get('state');
  // }
  // get comments(){
  //   return this.form.get('comments');
  // }

  onSubmit() {
    let form_values = this.form.value;
    const form_data = new FormData();
    const client_id: any = this.client_id?.value;
    const equipment_type: any = this.equipment_type?.value;
    const brand: any = this.brand?.value;
    const model: any = this.model?.value;
    const serie: any = this.serie?.value;
    const capability: any = this.capability?.value;
    const comments: any = this.comments?.value;

    form_data.append('client_id', client_id);
    form_data.append('equipment_type', equipment_type);
    form_data.append('brand', brand);
    form_data.append('model', model);
    form_data.append('serie', serie);
    form_data.append('capability', capability);
    form_data.append('comments', comments);

    this.file_inputs.forEach((item, i) => {
      var file: any = item.nativeElement as HTMLInputElement;

      // Verifica si hay archivos seleccionados
      if (file.files && file.files.length > 0) {
        let file_aux: any = file?.files[0];
        form_data.append(`photos[]`, file_aux, `photo_${i}`);
      }
    });

    console.log(form_data);

    this.createEvent.emit(form_data);
    this.modal.dismiss();
  }
}
