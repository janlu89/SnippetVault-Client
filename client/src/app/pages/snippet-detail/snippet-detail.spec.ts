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
import { HighlightAuto } from 'ngx-highlightjs';
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
    HighlightAuto,  // The ngx-highlightjs directive for automatic language detection
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
    private route: ActivatedRoute,   // Gives you access to the current route's params
    private router: Router,
    private snippetService: SnippetService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // ActivatedRoute.snapshot.paramMap reads the :id segment from the URL.
    // If the user navigates to /snippets/abc-123, this reads 'abc-123'.
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
  // This drives the visibility of the edit and delete buttons.
  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    const snippet = this.snippet();
    if (!currentUser || !snippet) return false;
    // Compare the userId from the JWT token against the snippet's author username.
    // Note: your AuthResponse contains 'username', and SnippetResponse contains 'username'.
    // We compare usernames here — if you stored userId in AuthResponse you could
    // compare IDs directly which would be more reliable. We'll use username for now.
    return currentUser.username === snippet.username;
  }

  deleteSnippet() {
    const snippet = this.snippet();
    if (!snippet) return;

    // Simple browser confirm dialog for now — we'll replace this with a 
    // MatDialog confirmation in the polish day if time permits.
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