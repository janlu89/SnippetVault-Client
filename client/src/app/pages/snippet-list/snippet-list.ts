import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SnippetService } from '../../services/snippet.service';
import { AuthService } from '../../services/auth.service';
import { SnippetListResponse } from '../../models/snippet.models';
import { APP_ROUTES } from '../../constants/app.routes.constants';
import { Highlight } from 'ngx-highlightjs';

const SUPPORTED_LANGUAGES = [
  'C#', 'TypeScript', 'JavaScript', 'Python', 'Java',
  'Go', 'Rust', 'SQL', 'HTML', 'CSS', 'Bash', 'Other'
];

@Component({
  selector: 'app-snippet-list',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DatePipe,
    MatCardModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatChipsModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatIconModule,Highlight
  ],
  templateUrl: './snippet-list.html',
  styleUrl: './snippet-list.scss'
})
export class SnippetList implements OnInit {
  // These three properties drive the template's visual state.
  // They MUST be Signals because they change inside async callbacks
  // (HTTP subscribe handlers), and zoneless change detection only
  // re-renders the template when a Signal it reads changes value.
  // Plain properties changed inside async callbacks are invisible to
  // Angular's change detection in a zoneless application.
  snippetList = signal<SnippetListResponse | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  // Filter properties stay as plain properties because they're written
  // by [(ngModel)], which Angular's forms module handles separately.
  // Angular knows about ngModel changes through a different mechanism
  // that doesn't require Signals.
  searchTerm = '';
  selectedLanguage = '';
  selectedTag = '';
  currentPage = 1;
  pageSize = 10;

  readonly languages = SUPPORTED_LANGUAGES;
  readonly appRoutes = APP_ROUTES;

  constructor(
    private snippetService: SnippetService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSnippets();
  }

  loadSnippets() {
    // signal.set() is how you update a Signal's value —
    // Angular immediately knows to re-evaluate any template
    // that reads this Signal.
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.snippetService.getSnippets(
      this.currentPage,
      this.pageSize,
      this.searchTerm || undefined,
      this.selectedLanguage || undefined,
      this.selectedTag || undefined
    ).subscribe({
      next: (response) => {
        // When these Signals are set inside the subscribe callback,
        // Angular sees the change and re-renders the template immediately —
        // even though this is inside an async callback with no Zone.js watching.
        this.snippetList.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to load snippets. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadSnippets();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadSnippets();
  }

  getCodePreview(codeBody: string): string {
    return codeBody.length > 150
      ? codeBody.substring(0, 150) + '...'
      : codeBody;
  }
}