import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../shared/services/auth.service';
import { CrudService } from '../../../../../shared/services/crud.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  // @Input() name: string = '';
  clients: any[] = [];
  photos_data: any[] = [];
  form!: FormGroup;

  @Input() data: any = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  @ViewChildren('file_input') file_inputs!: QueryList<ElementRef>;
typeof: any;

  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      // full_name: ['', Validators.required],
      client_id: [this.data.client_id ?? '', Validators.required],
      equipment_type: [this.data.equipment_type ?? '', Validators.required],
      brand: [this.data.brand ?? '', Validators.required],
      model: [this.data.model ?? '', Validators.required],
      serie: [this.data.serie ?? '', Validators.required],
      capability: [this.data.capability ?? '', Validators.required],
      comments: [this.data.comments ?? ''],
      state: [this.data.state ?? ''],
      photos: this.fb.array([]),
    });
    this.crudService.api_path_list = '/clients';
    this.crudService.auth_token = this.authService.token;

    this.photos_data = this.data.photos.split(', ');

    for(let i = 0 ; i < this.photos_data.length ; i++){
      this.addPhotoBlank();
    }

    

    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      this.clients = resp ?? [];
      // this.client_id?.setValue(this.data.id);
    });
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
  get comments() {
    return this.form.get('comments');
  }
  get state() {
    return this.form.get('state');
  }
  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }
  // get comments(){
  //   return this.form.get('comments');
  // }

  //manejo de agregar o quitar fotos
  addPhotoBlank() {
    if (this.photos.controls.length >= 10) return;
    this.photos.push(this.newPhoto());
  }
  addPhoto() {
    if (this.photos.controls.length >= 10) return;
    this.photos.push(this.newPhoto(true));
    this.photos_data.push(null);
  }
  newPhoto(required: boolean = false): FormGroup {
    if(required){
      console.log('si es requerido');
      return this.fb.group({
        photo: [null, [Validators.required]],
      });
    }else{
      return this.fb.group({
        photo: [null],
      });
    }

  }
  removePhoto() {
    if (this.photos.controls.length <= 1) return;
    this.photos.removeAt(this.photos.length - 1);
    this.photos_data.pop();

  }

  //manejo del preview de las fotos
  handleFileInput(event: Event, i: any) {
    const target = event.target as HTMLInputElement;

    const files = target.files as FileList;

    const file = files[0];
    this.photos_data[i] = file;
    // if(file){
    //   // Actualizamos el valor del formulario
    //   this.photos.controls[i].get('photo')?.setValue(file);
    // }
    if (file) this.readFile(file, i);
  }

  readFile(file: File, i: any) {
    const reader = new FileReader();

    reader.onloadend = () => {

      let preview = reader.result as string;
      let input = document.querySelector('#img-file-' + i) as HTMLInputElement;
      input.src = preview;
    };
    reader.readAsDataURL(file);
  }

  validateSrcImg(i: any){
    if(i < this.photos_data.length && typeof this.photos_data[i] === 'string'){
      return true;
    }else{
      return false;
    }
    // return '/assets/media/receptions/placeholder.png';
  }

  onSubmit() {
    this.form.addControl('id', this.fb.control(this.data.id));
    const form_data = new FormData();
    // const id: any = this.data.id;
    // const client_id: any = this.client_id?.value;
    // const equipment_type: any = this.equipment_type?.value;
    // const brand: any = this.brand?.value;
    // const model: any = this.model?.value;
    // const serie: any = this.serie?.value;
    // const capability: any = this.capability?.value;
    // const comments: any = this.comments?.value;

    form_data.append('id', this.data.id);
    form_data.append('client_id', this.client_id?.value);
    form_data.append('equipment_type', this.equipment_type?.value);
    form_data.append('brand', this.brand?.value);
    form_data.append('model', this.model?.value);
    form_data.append('serie', this.serie?.value);
    form_data.append('capability', this.capability?.value);
    form_data.append('comments', this.comments?.value);

    this.photos_data.forEach((item: any, i: any) => {
      // var file: any = item.nativeElement as HTMLInputElement;

      // Verifica si hay archivos seleccionados
      // if (file.files && file.files.length > 0) {
      //   let file_aux: any = file?.files[0];
      let item_aux:any = item;
      form_data.append(`photos_${i}`, item_aux); 
      // if(typeof item == 'string'){
      // }else{
      //   form_data.append(`photos_file_${i}`, item_aux);
      // }

      // }
    });

    console.log(form_data, 'last form data');

    this.editEvent.emit(form_data);
    this.modal.dismiss();
  }
}
