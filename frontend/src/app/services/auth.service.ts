import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../environments/environment';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hc_token';
  private readonly USER_KEY = 'hc_user';
  private api = environment.apiUrl;

  currentUser = signal<User | null>(this.loadUser());
  isLoggedIn = signal<boolean>(!!this.loadToken());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.success) this.storeSession(res.token, res.user);
      })
    );
  }

  register(name: string, email: string, password: string, role: UserRole = 'user', extra?: Record<string, unknown>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/register`, { name, email, password, role, ...extra }).pipe(
      tap(res => {
        // Only store session for non-pending users (patients log in immediately)
        if (res.success && res.user?.status !== 'pending') this.storeSession(res.token, res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/home']);
  }

  updateProfile(updates: Partial<User>): Observable<{ success: boolean; user: User }> {
    return this.http.put<{ success: boolean; user: User }>(`${this.api}/auth/me`, updates).pipe(
      tap(res => {
        if (res.success) {
          const updated = { ...this.currentUser()!, ...res.user };
          localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
          this.currentUser.set(updated);
        }
      })
    );
  }

  getCurrentUser(): User | null { return this.currentUser(); }
  isAuthenticated(): boolean { return this.isLoggedIn(); }
  getUserRole(): UserRole | null { return this.currentUser()?.role ?? null; }
  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }
}
