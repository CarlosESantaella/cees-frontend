import { Injectable, ViewChild } from '@angular/core';
//create components

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { AdminComponent } from '../../../../../modules/system/admin/admin.component';
@Injectable({
  providedIn: 'root'
})
export class ActionCreateTableService {
  @ViewChild(AdminComponent) adminComponent!: AdminComponent;

  constructor(
    private ngbModal: NgbModal,
    public dialog: MatDialog,
    public authService: AuthService,
  ) { }

 
}
