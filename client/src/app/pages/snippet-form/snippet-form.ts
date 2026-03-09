import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SnippetService } from '../../services/snippet.service';
import { TagService } from '../../services/tag.service';
import { APP_ROUTES } from '../../constants/app.routes.constants';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { TitleService } from '../../services/title.service';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const SUPPORTED_LANGUAGES = [
  'C#', 'TypeScript', 'JavaScript', 'Python', 'Java',
  'Go', 'Rust', 'SQL', 'HTML', 'CSS', 'Bash', 'Other'
];

@Component({
  selector: 'app-snippet-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './snippet-form.html',
  styleUrl: './snippet-form.scss'
})
export class SnippetForm implements OnInit {
  snippetForm: FormGroup;

  tags: string[] = [];
  tagSuggestions = signal<string[]>([]);

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  isEditMode = false;
  snippetId: string | null = null;
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');

  readonly languages = SUPPORTED_LANGUAGES;
  readonly appRoutes = APP_ROUTES;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snippetService: SnippetService,
    private tagService: TagService,
    private notificationService: NotificationService,
    private titleService: TitleService
  ) {
    this.snippetForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      codeBody: ['', Validators.required],
      language: ['', Validators.required],
      isPublic: [true]   // Default to public — most snippets in a portfolio are public
    });
  }

  ngOnInit() {
    this.snippetId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.snippetId;
    this.titleService.setTitle(this.isEditMode ? 'Edit Snippet' : 'New Snippet');

    if (this.isEditMode && this.snippetId) {
      this.loadExistingSnippet(this.snippetId);
    }
  }

  loadExistingSnippet(id: string) {
    this.isLoading.set(true);
    this.snippetService.getSnippetById(id).subscribe({
      next: (snippet) => {
        this.snippetForm.patchValue({
          title: snippet.title,
          description: snippet.description ?? '',
          codeBody: snippet.codeBody,
          language: snippet.language,
          isPublic: snippet.isPublic
        });
        this.tags = [...(snippet.tags ?? [])];
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to load snippet.');
        this.isLoading.set(false);
      }
    });
  }

  onTagSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (value.trim().length < 1) {
    this.tagSuggestions.set([]);
    return;
  }
  this.tagService.getTags(value).subscribe({
    next: (tags) => {
      if (!Array.isArray(tags)) {
        this.tagSuggestions.set([]);
        return;
      }
      this.tagSuggestions.set(
        tags
          .map(t => t.name)
          .filter(name => !this.tags.includes(name))
      );
    },
    error: () => this.tagSuggestions.set([])
  });
}

  onTagSelected(event: MatAutocompleteSelectedEvent, tagInput: HTMLInputElement) {
    this.addTag(event.option.value);
    tagInput.value = '';
    this.tagSuggestions.set([]);
  }

  onTagInputConfirm(event: MatChipInputEvent) {
    const value = event.value.trim().toLowerCase();
    if (value && !this.tags.includes(value)) {
      this.addTag(value);
    }
    event.chipInput.clear();
    this.tagSuggestions.set([]);
  }

  addTag(tag: string) {
    const normalised = tag.trim().toLowerCase();
    if (normalised && !this.tags.includes(normalised)) {
      this.tags = [...this.tags, normalised];
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit() {
    if (this.snippetForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const request = {
      ...this.snippetForm.value,
      tags: this.tags
    };

    // Choose create or update based on the mode detected in ngOnInit
    const operation = this.isEditMode && this.snippetId
      ? this.snippetService.updateSnippet(this.snippetId, request)
      : this.snippetService.createSnippet(request);

    operation.subscribe({
      next: (snippet) => {
        this.notificationService.success(
          this.isEditMode ? 'Snippet updated successfully!' : 'Snippet created successfully!'
        );
        this.router.navigate([this.appRoutes.snippetDetail(snippet.id)]);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message ?? 'Failed to save snippet.');
        this.isSubmitting.set(false);
      }
    });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Snippet' : 'New Snippet';
  }

  get submitLabel(): string {
    return this.isEditMode ? 'Save Changes' : 'Create Snippet';
  }
}