import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  public currentUser = this.currentUserSubject.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);

          // Convertir el user de la respuesta al tipo User
          const userData: User = {
            _id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role as any,
          };

          localStorage.setItem('user', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }

  private getUserFromLocalStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  updateProfile(userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userData);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
  isReader(): boolean {
    return this.hasRole('reader');
  }

  isRegisteredUser(): boolean {
    return this.hasRole('registered_user');
  }

  isJournalist(): boolean {
    return this.hasRole('journalist');
  }

  isModerator(): boolean {
    return this.hasRole('moderator');
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificaciones combinadas
  canComment(): boolean {
    return this.hasAnyRole(['registered_user', 'journalist', 'moderator', 'admin']);
  }

  canCreateNews(): boolean {
    return this.hasAnyRole(['journalist', 'moderator', 'admin']);
  }

  canModerate(): boolean {
    return this.hasAnyRole(['moderator', 'admin']);
  }

  // Redirección basada en rol
  getDefaultRoute(): string {
    const user = this.currentUserValue;
    if (!user) return '/';

    switch (user.role) {
      case 'admin':
        return '/dashboard';
      case 'moderator':
        return '/moderation';
      case 'journalist':
        return '/my-news';
      case 'registered_user':
        return '/news';
      case 'reader':
      default:
        return '/news';
    }
  }
}
