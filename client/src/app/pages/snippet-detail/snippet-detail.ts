import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Highlight } from 'ngx-highlightjs';
import { SnippetService } from '../../services/snippet.service';
import { AuthService } from '../../services/auth.service';
import { TitleService } from '../../services/title.service';
import { SnippetResponse } from '../../models/snippet.models';
import { APP_ROUTES } from '../../constants/app.routes.constants';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-snippet-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    Highlight
  ],
  templateUrl: './snippet-detail.html',
  styleUrl: './snippet-detail.scss'
})
export class SnippetDetail implements OnInit {
  snippet = signal<SnippetResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  isDeleting = signal(false);

  readonly appRoutes = APP_ROUTES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snippetService: SnippetService,
    public authService: AuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([this.appRoutes.snippets]);
      return;
    }
    this.loadSnippet(id);
  }

  loadSnippet(id: string) {
    this.isLoading.set(true);
    this.snippetService.getSnippetById(id).subscribe({
      next: (response) => {
        this.snippet.set(response);
        this.titleService.setTitle(response.title);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Snippet not found.');
        this.isLoading.set(false);
      }
    });
  }

  // Checks whether the currently logged-in user is the owner of this snippet.
  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    const snippet = this.snippet();
    if (!currentUser || !snippet) return false;
    return currentUser.username === snippet.username;
  }

  deleteSnippet() {
    const snippet = this.snippet();
    if (!snippet) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Snippet',
        message: `Are you sure you want to delete "${snippet.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.isDeleting.set(true);
      this.snippetService.deleteSnippet(snippet.id).subscribe({
        next: () => {
          this.notificationService.success('Snippet deleted successfully.');
          this.router.navigate([this.appRoutes.snippets]);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message ?? 'Failed to delete snippet.');
          this.isDeleting.set(false);
        }
      });
    });
  }
}