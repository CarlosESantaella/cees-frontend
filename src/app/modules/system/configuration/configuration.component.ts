import { Component } from '@angular/core';
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

  data: any = {};
  form_items!: FormGroup;
  configuration_id: any = '';

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public crudService: CrudService,
    public toastService: ToastService,
  ){
  }

  ngOnInit(){
    this.form_items = this.fb.group({
      currency: [this.data.currency ?? '', [Validators.required, Validators.maxLength(3)]],
    });
    this.crudService.api_path_show = '/configurations';
    this.crudService.auth_token = this.authService.token;

    this.crudService.show('').subscribe((resp: any) => {
      // this.tableService.DATA = resp;
      console.log(resp, 'hola mundo');
      this.configuration_id = resp.id;
      this.currency?.setValue(resp.currency);
    });
    
  }

  get currency() {
    return this.form_items.get('currency');

  }

  onSubmitItems(){
    this.crudService.api_path_update = '/configurations';
    // let data = new FormData();
    // data.append('currency', this.currency?.value);
    let data: any = {
      "currency": this.currency?.value
    };
    this.crudService.update(data, '').subscribe((resp) => {
      if(!resp?.error){
        this.toastService.show({
          message: 'Signo monetario de items editado con exito',
          classname: 'bg-success text-dark',
        });
      }
    });
  }
}
