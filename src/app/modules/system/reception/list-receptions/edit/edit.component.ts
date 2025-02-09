import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
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
  @ViewChild('created_at_form') created_at_form!: ElementRef;


  constructor(
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    public crudService: CrudService,
    public authService: AuthService,
    // public datePipe: DatePipe
  ) {}

  ngOnInit() {
    console.log(this.data.created_at);


    
    let client_id: number = parseInt(this.data.client_id, 10);
    this.form = this.fb.group({
      // full_name: ['', Validators.required],
      client_id: [client_id ?? '', Validators.required],
      equipment_type: [this.data.equipment_type ?? ''],
      brand: [this.data.brand ?? ''],
      model: [this.data.model ?? ''],
      serie: [this.data.serie ?? ''],
      capability: [this.data.capability ?? ''],
      comments: [this.data.comments ?? ''],
      state: [this.data.state ?? ''],
      location: [this.data.location ?? ''],
      specific_location: [this.data.specific_location ?? ''],
      type_of_job: [this.data.type_of_job ?? ''],
      created_at: [''],
      equipment_owner: [this.data.equipment_owner ?? '', Validators.required],
      customer_inventory: [this.data.customer_inventory ?? ''],
      photos: this.fb.array([]),
    });
    // this.created_at?.setValue(full_date);
    this.crudService.api_path_list = '/clients';
    this.crudService.auth_token = this.authService.token;

    this.photos_data = this.data.photos.split(', ');

    for(let i = 0 ; i < this.photos_data.length ; i++){
      this.addPhotoBlank();
    }


    // const parsedDate = new Date(this.data.created_at);
    // const year = parsedDate.getFullYear();
    // const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    // const day = parsedDate.getDate().toString().padStart(2, '0');
    // let full_date: any = `${year}-${month}-${day}`;
    console.log(this.data.created_at.split('T')[0]);
    this.created_at?.setValue(this.data.created_at.split('T')[0]);

    

    this.crudService.list().subscribe((resp) => {
      // this.tableService.DATA = resp;
      this.clients = resp ?? [];
      // this.client_id?.setValue(this.data.id);
    });
  }

  ngAfterViewInit(){
    // const parsedDate = new Date(this.data.created_at);
    // const year = parsedDate.getFullYear();
    // const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    // const day = parsedDate.getDate().toString().padStart(2, '0');
    // let full_date: any = `${day}-${month}-${year}`;
    // this.created_at_form.nativeElement.value = full_date;
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
  get created_at() {
    return this.form.get('created_at');
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
  handleFileInput(event: any, i: any) {
    const target = event.target as HTMLInputElement;

    const files = target.files as FileList;

    const file = files[0];

    if(files.length > 0){
      let validate_file = this.validateImageType(file);
      if(validate_file){
        this.photos_data[i] = file;
        if (file) this.readFile(file, i);

      }else{
        event.target.value = null;
      }
    }
    // if(file){
    //   // Actualizamos el valor del formulario
    //   this.photos.controls[i].get('photo')?.setValue(file);
    // }
    // if (file) this.readFile(file, i);
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
        this.customer_inventory?.setValue(resp.customer_inventory);
        this.equipment_owner?.setValue(resp.equipment_owner);
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
        this.customer_inventory?.setValue(resp.customer_inventory);
        this.equipment_owner?.setValue(resp.equipment_owner);
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
    this.form.addControl('id', this.fb.control(this.data.id));
    const form_data = new FormData();

    form_data.append('id', this.data.id);
    form_data.append('client_id', this.client_id?.value);
    form_data.append('equipment_type', this.equipment_type?.value);
    form_data.append('brand', this.brand?.value);
    form_data.append('model', this.model?.value);
    form_data.append('serie', this.serie?.value);
    form_data.append('capability', this.capability?.value);
    form_data.append('location', this.location?.value);
    form_data.append('specific_location', this.specific_location?.value);
    form_data.append('type_of_job', this.type_of_job?.value);
    form_data.append('equipment_owner', this.equipment_owner?.value);
    form_data.append('customer_inventory', this.customer_inventory?.value);
    form_data.append('created_at', this.created_at?.value);
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

    this.editEvent.emit(form_data);
    this.modal.dismiss();
  }
}
