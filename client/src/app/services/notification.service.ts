import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly SUCCESS_DURATION = 3000;
  private readonly ERROR_DURATION = 5000;

  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: this.SUCCESS_DURATION,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: this.ERROR_DURATION,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}