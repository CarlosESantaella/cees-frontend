import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * @title Dialog Animations
 */
@Component({
    selector: 'confirmation-dialog-component',
    styleUrls: ['confirmation-dialog.component.css'],
    templateUrl: 'confirmation-dialog.component.html',
    imports: [MatButtonModule]
})
export class ConfirmationDialogComponent {

  constructor(public dialog: MatDialog) {}

  openDialog222(): void {
    this.dialog
      .open(ConfirmationDialog, {
        data: {title: 'Eliminar2', message: 'seguroo deseas eliminar este registro?'}
        
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          alert('¡A mí también!');
        } else {
          alert('Deberías probarlo, a mí me gusta :)');
        }
      });
  }
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent
    ]
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  
  onCancelClick(): void {
    this.dialogRef.close(false);
  }

}
