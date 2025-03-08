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
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create.component.html',
    styleUrl: './create.component.css'
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
      equipment_type: [''],
      brand: [''],
      model: [''],
      serie: [''],
      capability: [''],
      location: [''],
      specific_location: [''],
      type_of_job: ['Nuevo'],
      equipment_owner: ['', Validators.required],
      customer_inventory: [''],
      comments: [''],
      // state: ['', Validators.required],
    });

    this.crudService.list().subscribe((resp) => {
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
  get location() {
    return this.form.get('location');
  }
  get specific_location() {
    return this.form.get('specific_location');
  }
  get type_of_job() {
    return this.form.get('type_of_job');
  }
  get equipment_owner() {
    return this.form.get('equipment_owner');
  }
  get customer_inventory() {
    return this.form.get('customer_inventory');
  }
  // get state() {
  //   return this.form.get('state');
  // }
  get comments() {
    return this.form.get('comments');
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

  // validateImageArray(control: any) {
  //   const images = control.value;
  //   const tipoPermitido = ['image/jpeg', 'image/png', 'image/gif']; // Puedes ajustar según tus necesidades

  //   for (const image of images) {
  //     const tipoArchivo = image.type;
  //     if (!tipoPermitido.includes(tipoArchivo)) {
  //       return { tipoInvalido: true };
  //     }
  //   }

  //   return null;
  // }

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
  handleFileInput(event: any, i: any) {
    const target = event.target as HTMLInputElement;

    const files = target.files as FileList;

    const file = files[0];



    if (files.length > 0) {
      let validate_file = this.validateImageType(file);
      if (validate_file) {
        if (file) this.readFile(file, i);
      } else {
        event.target.value = null;
      }
    }

    // if(file){
    //   // Actualizamos el valor del formulario
    //   this.photos.controls[i].get('photo')?.setValue(file);
    // }
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

  validateImageType(file: File): boolean {
    const tipoPermitido = ['image/jpeg', 'image/png', 'image/gif']; // Ajusta según tus necesidades
    return tipoPermitido.includes(file.type);
  }

  validateSerie($event: any) {
    const target = $event.target as HTMLInputElement;
    this.crudService.api_path_show = '/receptions/find';
    let query_params: string = '';
    query_params = '?serial='+target.value;
    query_params += '&location=none';
    query_params += '&specific_location=none';
    query_params += '&customer_inventory=none';
    console.log(query_params);

    this.crudService.show(query_params).subscribe((resp) => {
      // this.tableService.DATA = resp;
      if(resp.exists){
        this.equipment_type?.setValue(resp.equipment_type);
        this.brand?.setValue(resp.brand);
        this.model?.setValue(resp.model);
        this.serie?.setValue(resp.serie);
        this.capability?.setValue(resp.capability);
        this.location?.setValue(resp.location);
        this.specific_location?.setValue(resp.specific_location);
        this.type_of_job?.setValue(resp.type_of_job);
        this.equipment_owner?.setValue(resp.equipment_owner);
        this.customer_inventory?.setValue(resp.customer_inventory);
        this.comments?.setValue(resp.comments);
      }
    });
    // console.log($event.target.value);
  }

  validateUbications($event: any){
    const target = $event.target as HTMLInputElement;
    this.crudService.api_path_show = '/receptions/find';
    let query_params: string = '';
    query_params = '?serial=none';
    query_params += '&location='+this.location?.value;
    query_params += '&specific_location='+this.specific_location?.value;
    query_params += '&customer_inventory=none';

    this.crudService.show(query_params).subscribe((resp) => {
      // this.tableService.DATA = resp;
      if(resp.exists){
        this.equipment_type?.setValue(resp.equipment_type);
        this.brand?.setValue(resp.brand);
        this.model?.setValue(resp.model);
        this.serie?.setValue(resp.serie);
        this.capability?.setValue(resp.capability);
        this.location?.setValue(resp.location);
        this.specific_location?.setValue(resp.specific_location);
        this.type_of_job?.setValue(resp.type_of_job);
        this.equipment_owner?.setValue(resp.equipment_owner);
        this.customer_inventory?.setValue(resp.customer_inventory);
        this.comments?.setValue(resp.comments);
      }
    });
  }

  validateCustomerInventory($event: any){
    const target = $event.target as HTMLInputElement;
    this.crudService.api_path_show = '/receptions/find';
    let query_params: string = '';
    query_params = '?serial=none';
    query_params += '&location=none';
    query_params += '&specific_location=none';
    query_params += '&customer_inventory='+target.value;
    console.log(query_params);

    this.crudService.show(query_params).subscribe((resp) => {
      // this.tableService.DATA = resp;
      if(resp.exists){
        this.equipment_type?.setValue(resp.equipment_type);
        this.brand?.setValue(resp.brand);
        this.model?.setValue(resp.model);
        this.serie?.setValue(resp.serie);
        this.capability?.setValue(resp.capability);
        this.location?.setValue(resp.location);
        this.specific_location?.setValue(resp.specific_location);
        this.type_of_job?.setValue(resp.type_of_job);
        this.customer_inventory?.setValue(resp.customer_inventory);
        this.equipment_owner?.setValue(resp.equipment_owner);
        this.comments?.setValue(resp.comments);
      }
    });
    

  }

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
    console.log(client_id, 'id del cliente');

    form_data.append('client_id', client_id);
    form_data.append('equipment_type', equipment_type);
    form_data.append('brand', brand);
    form_data.append('model', model);
    form_data.append('serie', serie);
    form_data.append('capability', capability);
    form_data.append('location', this.location?.value);
    form_data.append('specific_location', this.specific_location?.value);
    form_data.append('type_of_job', this.type_of_job?.value);
    form_data.append('equipment_owner', this.equipment_owner?.value);
    form_data.append('customer_inventory', this.customer_inventory?.value);
    form_data.append('comments', comments);

    this.file_inputs.forEach((item, i) => {
      var file: any = item.nativeElement as HTMLInputElement;

      // Verifica si hay archivos seleccionados
      if (file.files && file.files.length > 0) {
        let file_aux: any = file?.files[0];
        form_data.append(`photos[]`, file_aux, `photo_${i}`);
      }
    });

    console.log(form_data, 'form dataaas');

    this.createEvent.emit(form_data);
    this.modal.dismiss();
  }
}
