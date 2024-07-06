import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  api_path_list: string = '';
  api_path_show: string = '';
  api_path_patch: string = '';
  api_path_create: string = '';
  api_path_update: string = '';
  api_path_update_patch: string = '';
  api_path_update_post: string = '';
  api_path_delete: string = '';

  auth_token: string = '';

  constructor(public http: HttpClient, public authService: AuthService, @Inject(ToastService) private toastService: ToastService) // public authservice: AuthService
  {}

  get(url: string){
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let full_url = environment.api_domain + url;
    
    return this.http
      .get(full_url, {
        headers: headers
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  patch(url: string, data: any){
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + url;

    return this.http
      .patch(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  put(url: string, data: any){
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + url;

    return this.http
      .put(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  post(url: string, data: any){
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + url;

    return this.http
      .post(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }



  list(search?: any, state?: any) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + this.api_path_list;
    console.log(URL, 'url');
    return this.http
      .get(URL, {
        headers: headers
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        }) 
      );
  }

  show(id: string | number) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.auth_token,
    });
    let URL = environment.api_domain + this.api_path_show + id;
    console.log(URL, 'url');
    
    return this.http
      .get(URL, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  create(data: any) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + this.api_path_create;

    return this.http
      .post(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  update(data: any, id: string | number) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`
    });

    let URL = environment.api_domain + this.api_path_update + id;

    console.log(data, 'antes de enviar');
    
    return this.http
      .put(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          
          let errors = error.error?.errors;

          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }



  updatePatch(data: any, id: string | number) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`
    });

    let URL = environment.api_domain + this.api_path_update_patch + id;

    console.log(data, 'antes de enviar');
    
    return this.http
      .patch(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  updatePost(data: any, id: string | number) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`
    });

    let URL = environment.api_domain + this.api_path_update_post + id;
    console.log(data, 'antes de enviar');

    return this.http
      .post(URL, data, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  delete(id: string | number) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + this.api_path_delete + id;

    return this.http
      .delete(URL, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }

  deleteApi(url: string) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth_token}`,
    });
    let URL = environment.api_domain + url;

    return this.http
      .delete(URL, {
        headers: headers,
      })
      .pipe(
        catchError((error: any) => {
          if(error.status == 401){
            if(error.error?.error == 'Token inválido' || error.error?.error == 'Token expirado'){
              this.authService.logout();
            }
          }
          let errors = error.error?.errors;
          if(errors && errors.length > 0){
            const keys = Object.keys(errors);
            keys.forEach(key => {
              let value = errors[key];
              this.toastService.show({ message: errors[key], classname: 'bg-danger text-light'});
            });
          }
          return of(error);
        })
      );
  }


  
}
