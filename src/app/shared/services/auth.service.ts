import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, finalize, map, of, switchMap, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(
    public http_client: HttpClient,
    public toastService: ToastService,
    public router: Router,
    public modal: NgbModal
  ) {}

  get token(){
    return localStorage.getItem('token') || '';
  }

  set token(token: string){
    localStorage.setItem('token', token);
  }

  get user(){
    return localStorage.getItem('user') || '';
  }

  set user(user: string){
    localStorage.setItem('user', user);
  }

  private handleError(error?: any) {
    if(error.status == 401){
      // this.logout();
    }
    return throwError(() => error);
  }
  login(email: string, password: string): any {
    return this.http_client
      .post(`${environment.api_domain}/auth`, {
        username: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        finalize(() => {})
      );
  }
  logout(){
    localStorage.clear();
    if(this.modal.hasOpenModals()){
      this.modal.dismissAll();
    }
    this.router.navigate(['/system/auth/login']);
  }
  me(){
    console.log(this.token, 'hola mundo 55');
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.token,
    });

    return this.http_client
    .get(`${environment.api_domain}/auth/me`, {headers})
    .pipe(
      catchError(this.handleError),
      finalize(() => {})
    );
  }

  forgotPassword(email: string){
    return this.http_client
    .post(`${environment.api_domain}/auth/forgot-password`, {
      email: email,
    })
    .pipe(
      catchError(this.handleError),
      finalize(() => {})
    );
  }

  resetPassword(password: string, token: string){
    return this.http_client
    .post(`${environment.api_domain}/auth/reset-password`, {
      password: password,
      token: token,
    })
    .pipe(
      catchError(this.handleError),
      finalize(() => {})
    );
  }


}
