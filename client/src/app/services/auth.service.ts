import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';
import { API_ROUTES } from '../constants/api.constants';
import { APP_ROUTES } from '../constants/app.routes.constants'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly STORAGE_KEY = 'snippetvault_auth';
  private readonly baseUrl = environment.apiUrl;

  private authResponse = signal<AuthResponse | null>(this.loadFromStorage());

  isLoggedIn = computed(() => this.authResponse() !== null);
  currentUser = computed(() => this.authResponse());

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}${API_ROUTES.auth.register}`, 
      request
    ).pipe(
      tap(response => this.setAuth(response))
    );
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}${API_ROUTES.auth.login}`, 
      request
    ).pipe(
      tap(response => this.setAuth(response))
    );
  }

  logout() {
    localStorage.removeItem(AuthService.STORAGE_KEY);
    this.authResponse.set(null);
    this.router.navigate([APP_ROUTES.login]);
  }

  getToken(): string | null {
    return this.authResponse()?.token ?? null;
  }

  private setAuth(response: AuthResponse) {
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(response));
    this.authResponse.set(response);
  }

  private loadFromStorage(): AuthResponse | null {
    const stored = localStorage.getItem(AuthService.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}