import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <header class="app-header">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/news" class="logo-link"> 🌐 HyperNews </a>
          </div>

          <nav class="main-nav" *ngIf="authService.isLoggedIn()">
            <a *ngIf="authService.canCreateNews()" routerLink="/create-news" class="nav-link">
              ✏️ Crear Noticia
            </a>
            <a *ngIf="authService.canCreateNews()" routerLink="/my-news" class="nav-link">
              📋 Mis Noticias
            </a>
            <a *ngIf="authService.canModerate()" routerLink="/moderation" class="nav-link">
              ⚡ Moderación
            </a>
            <a *ngIf="authService.isAdmin()" routerLink="/dashboard" class="nav-link">
              📊 Dashboard
            </a>
            <a *ngIf="authService.isAdmin()" routerLink="/users" class="nav-link"> 👥 Usuarios </a>
            <a routerLink="/news" class="nav-link">📰 Noticias</a>
          </nav>

          <div class="user-section" *ngIf="authService.isLoggedIn()">
            <div class="user-info">
              <span class="user-name">{{ authService.currentUserValue?.name }}</span>
              <span class="user-role">{{ getRoleText(authService.currentUserValue?.role) }}</span>
            </div>
            <button (click)="logout()" class="logout-btn">🚪 Salir</button>
          </div>

          <div class="auth-section" *ngIf="!authService.isLoggedIn()">
            <a routerLink="/login" class="auth-link">Iniciar Sesión</a>
            <a routerLink="/register" class="auth-link primary">Registrarse</a>
          </div>
        </div>
      </header>

      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [
    `
      .layout-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .app-header {
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
      }
      .logo-link {
        font-size: 1.5rem;
        font-weight: bold;
        color: #007bff;
        text-decoration: none;
      }
      .main-nav {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex: 1;
        margin: 0 2rem;
      }
      .nav-link {
        text-decoration: none;
        color: #333;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        white-space: nowrap;
      }
      .nav-link:hover {
        background: #f8f9fa;
      }
      .user-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .user-info {
        text-align: right;
      }
      .user-name {
        display: block;
        font-weight: 500;
        color: #333;
      }
      .user-role {
        display: block;
        font-size: 0.875rem;
        color: #666;
      }
      .logout-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .logout-btn:hover {
        background: #c82333;
      }
      .auth-section {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .auth-link {
        text-decoration: none;
        color: #333;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      .auth-link.primary {
        background: #007bff;
        color: white;
      }
      .auth-link:hover {
        background: #f8f9fa;
      }
      .auth-link.primary:hover {
        background: #0056b3;
      }
      .main-content {
        flex: 1;
        padding-top: 0;
      }
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          gap: 1rem;
        }
        .main-nav {
          margin: 0;
          order: 3;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  authService = inject(AuthService);

  getRoleText(role: string | undefined): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrador',
      moderator: 'Moderador',
      journalist: 'Periodista',
      registered_user: 'Usuario Registrado',
      reader: 'Lector',
    };
    return role ? roleMap[role] : 'Desconocido';
  }

  logout(): void {
    this.authService.logout();
  }
}
