import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TagResponse } from '../models/tag.models';
import { API_ROUTES } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTags(search?: string) {
    let params = new HttpParams();
    if (search?.trim()) params = params.set('search', search.trim());
    return this.http.get<TagResponse[]>(`${this.apiUrl}${API_ROUTES.tags.base}`, { params });
  }
}