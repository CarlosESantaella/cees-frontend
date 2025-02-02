import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsTableService {
  private actionSubject = new BehaviorSubject<any>(null);
  action$ = this.actionSubject.asObservable();
  constructor() { }

  notifyAction(action: any) {
    this.actionSubject.next(action);
  }
}
