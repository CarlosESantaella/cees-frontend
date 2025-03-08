import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FooterComponent } from '../partials/footer/footer.component';
import { HeaderComponent } from '../partials/header/header.component';
import { SidebarComponent } from '../partials/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { CrudService } from '../../../shared/services/crud.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';


@Component({
    selector: 'app-configuration',
    imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent, ReactiveFormsModule, CommonModule, ImageCropperModule],
    templateUrl: './configuration.component.html',
    styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  @ViewChildren('file_input') file_inputs!: ElementRef;
  @ViewChild('number_reception') number_reception!: ElementRef;

  data: any = {};
  form_general!: FormGroup;
  form_items!: FormGroup;
  form_receptions!: FormGroup;
  configuration_id: any = '';
  logo_data: any = null;
  number_reception_disabled: boolean = false;

  //image logo 
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  scale = 1;
  transform: ImageTransform = {
    translateUnit: 'px'
  };

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public crudService: CrudService,
    public toastService: ToastService,
  ) {
  }

  ngOnInit() {
    //init forms
    this.form_items = this.fb.group({
      currency: [this.data.currency ?? '', [Validators.required, Validators.maxLength(3)]],
    });
    this.form_general = this.fb.group({
      currency: [this.data.currency ?? '', [Validators.required, Validators.maxLength(3)]],
    });
    this.form_receptions = this.fb.group({
      logo_path: [null, []]
    });

    //get configurations
    this.crudService.api_path_show = '/configurations';
    this.crudService.auth_token = this.authService.token;

    this.crudService.show('').subscribe((resp: any) => {
      // this.tableService.DATA = resp;
      console.log(resp, 'hola mundo');
      this.configuration_id = resp.id;
      this.currency?.setValue(resp.currency);
      if (resp.logo_path) {
        this.logo_data = resp.logo_path;
      }
      if (resp.index_reception != null) {
        this.number_reception.nativeElement.value = resp.index_reception;
        this.number_reception_disabled = true;
      } else {
        this.number_reception_disabled = false;
      }
    });
  }

  get currency() {
    return this.form_items.get('currency');
  }

  get logo_path() {
    return this.form_items.get('logo_path');

  }

  onSubmitItems() {
    this.crudService.api_path_update_post = '/configurations';
    // let data = new FormData();
    // data.append('currency', this.currency?.value);
    let data: any = {
      "currency": this.currency?.value
    };
    this.crudService.updatePost(data, '').subscribe((resp) => {
      if (!resp?.error) {
        this.toastService.show({
          message: 'Signo monetario de items editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  onSubmitGeneral() {
    this.crudService.api_path_update_post = '/configurations';

    let form_data = new FormData();
    if (this.logo_data) {
      form_data.append('logo', this.logo_data);
    }

    this.crudService.updatePost(form_data, '').subscribe((resp) => {
      if (!resp?.error) {
        console.log(resp);
        this.toastService.show({
          message: 'Logo actualizado correctamente',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  onSubmitIndexReception() {
    if (this.number_reception.nativeElement.value != '') {
      this.crudService.post('/configurations', { index_reception: this.number_reception.nativeElement.value }).subscribe((resp) => {
        this.toastService.show({
          message: 'Numero de recepcion editado con exito',
          classname: 'bg-success text-dark',
        });
      });
      this.number_reception_disabled = true;
    }
  }

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }
  cropImg(e: any) {
    this.cropImgPreview = e.blob;
    console.log(e, 'listo 64');
    this.logo_data = e.blob;
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }
  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  validateNumbers($event: any) {
    const input = $event.target;
    const valor = input.value;
    const regex = /^[0-9]+$/;
    if (!regex.test(valor)) {
      this.number_reception.nativeElement.value = '';
    }
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }
}
