import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Highlight } from 'ngx-highlightjs';
import { SnippetService } from '../../services/snippet.service';
import { AuthService } from '../../services/auth.service';
import { SnippetResponse } from '../../models/snippet.models';
import { APP_ROUTES } from '../../constants/app.routes.constants';

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
    public authService: AuthService
  ) {}

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

    if (!confirm('Are you sure you want to delete this snippet? This cannot be undone.')) {
      return;
    }

    this.isDeleting.set(true);
    this.snippetService.deleteSnippet(snippet.id).subscribe({
      next: () => {
        // After deletion, navigate back to the list
        this.router.navigate([this.appRoutes.snippets]);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to delete snippet.');
        this.isDeleting.set(false);
      }
    });
  }
}