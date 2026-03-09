import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SnippetListResponse, SnippetResponse, CreateSnippetRequest, UpdateSnippetRequest } from '../models/snippet.models';
import { API_ROUTES } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSnippets(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    language?: string,
    tag?: string
  ) {
    // Build query parameters conditionally.
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search?.trim()) params = params.set('search', search.trim());
    if (language) params = params.set('language', language);
    if (tag) params = params.set('tag', tag);

    return this.http.get<SnippetListResponse>(`${this.baseUrl}${API_ROUTES.snippets.base}`, { params });
  }

  getSnippetById(id: string) {
    return this.http.get<SnippetResponse>(`${this.baseUrl}${API_ROUTES.snippets.byId(id)}`);
  }

  createSnippet(request: CreateSnippetRequest) {
    return this.http.post<SnippetResponse>(`${this.baseUrl}${API_ROUTES.snippets.base}`, request);
  }

  updateSnippet(id: string, request: UpdateSnippetRequest) {
    return this.http.put<SnippetResponse>(`${this.baseUrl}${API_ROUTES.snippets.byId(id)}`, request);
  }

  deleteSnippet(id: string) {
    // DELETE returns 204 No Content — no response body to type
    return this.http.delete<void>(`${this.baseUrl}${API_ROUTES.snippets.byId(id)}`);
  }
}