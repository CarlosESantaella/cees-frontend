import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsTableService {
  private accionSubject = new Subject<any>();
  action$ = this.accionSubject.asObservable();
  constructor() { }

  notifyAction(action: any) {
    this.accionSubject.next(action);
  }
}
