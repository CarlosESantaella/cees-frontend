import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FooterComponent } from '../partials/footer/footer.component';
import { HeaderComponent } from '../partials/header/header.component';
import { SidebarComponent } from '../partials/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { CrudService } from '../../../shared/services/crud.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  @ViewChildren('file_input') file_inputs!: ElementRef;

  data: any = {};
  form_items!: FormGroup;
  form_receptions!: FormGroup;
  configuration_id: any = '';
  logo_data: any = null;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public crudService: CrudService,
    public toastService: ToastService,
  ){
  }

  ngOnInit(){
    //init forms
    this.form_items = this.fb.group({
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
      if(resp.logo_path){
        this.logo_data = resp.logo_path;
      }
    });
  }

  get currency() {
    return this.form_items.get('currency');
  }

  get logo_path() {
    return this.form_items.get('logo_path');

  }

  onSubmitItems(){
    this.crudService.api_path_update_post = '/configurations';
    // let data = new FormData();
    // data.append('currency', this.currency?.value);
    let data: any = {
      "currency": this.currency?.value
    };
    this.crudService.updatePost(data, '').subscribe((resp) => {
      if(!resp?.error){
        this.toastService.show({
          message: 'Signo monetario de items editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }

  onSubmitReceptions(){
    this.crudService.api_path_update_post = '/configurations';

    let form_data = new FormData();
    if(this.logo_data){
      form_data.append('logo', this.logo_data);
    }

    this.crudService.updatePost(form_data, '').subscribe((resp) => {
      if(!resp?.error){
        console.log(resp);
        this.toastService.show({
          message: 'Logo actualizado correctamente',
          classname: 'bg-success text-dark',
        });
      }
    });
  }



  handleFileInput(event: any) {
    const target = event.target as HTMLInputElement;

    const files = target.files as FileList;

    const file = files[0];

    if(files.length > 0){
      let validate_file = this.validateImageType(file);
      if(validate_file){
        this.logo_data = file;
        if (file) this.readFile(file);

      }else{
        event.target.value = null;
      }
    }
  }
  readFile(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {

      let preview = reader.result as string;
      let input = document.querySelector('#logo') as HTMLInputElement;
      input.src = preview;
    };
    reader.readAsDataURL(file);
  }
  validateSrcImg(){
    if(this.logo_data && typeof this.logo_data === 'string'){
      return true;
    }else{
      return false;
    }
    // return '/assets/media/receptions/placeholder.png';
  }
  validateImageType(file: File): boolean {
    const tipoPermitido = ['image/jpeg', 'image/png', 'image/gif']; // Ajusta según tus necesidades
    return tipoPermitido.includes(file.type);
  }
}
