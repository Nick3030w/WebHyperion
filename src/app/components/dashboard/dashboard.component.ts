import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard de Administración</h1>
        <p>Bienvenido, {{ authService.currentUserValue?.name }}</p>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button *ngIf="authService.canModerate()" routerLink="/moderation" class="action-card">
            <div class="action-icon">📰</div>
            <h3>Moderar Contenido</h3>
            <p>Revisar noticias y comentarios pendientes</p>
          </button>

          <button *ngIf="authService.canCreateNews()" routerLink="/create-news" class="action-card">
            <div class="action-icon">✏️</div>
            <h3>Crear Noticia</h3>
            <p>Publicar nueva noticia</p>
          </button>

          <button *ngIf="authService.isAdmin()" routerLink="/users" class="action-card">
            <div class="action-icon">👥</div>
            <h3>Gestionar Usuarios</h3>
            <p>Administrar usuarios y roles</p>
          </button>

          <button routerLink="/my-news" class="action-card">
            <div class="action-icon">📋</div>
            <h3>Mis Noticias</h3>
            <p>Ver y editar mis publicaciones</p>
          </button>
        </div>
      </div>

      <div class="stats-section">
        <h2>Estadísticas del Sistema</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>Total Noticias</h3>
              <p class="stat-number">156</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Usuarios Registrados</h3>
              <p class="stat-number">89</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <h3>Comentarios</h3>
              <p class="stat-number">342</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <h3>Pendientes</h3>
              <p class="stat-number">12</p>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-content">
              <p><strong>Nueva noticia publicada</strong> - "Tecnología y Educación"</p>
              <span class="activity-time">Hace 2 horas</span>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">💬</div>
            <div class="activity-content">
              <p><strong>Nuevo comentario</strong> en "Avances en Medicina"</p>
              <span class="activity-time">Hace 4 horas</span>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">✅</div>
            <div class="activity-content">
              <p><strong>Noticia aprobada</strong> - "Innovación en Energía"</p>
              <span class="activity-time">Hace 6 horas</span>
            </div>
          </div>
        </div>
      </div>

      <div class="user-info">
        <h2>Tu Información</h2>
        <div class="user-card">
          <div class="user-avatar">
            {{ authService.currentUserValue?.name?.charAt(0) }}
          </div>
          <div class="user-details">
            <h3>{{ authService.currentUserValue?.name }}</h3>
            <p class="user-email">{{ authService.currentUserValue?.email }}</p>
            <p class="user-role">
              <span [class]="'role-badge ' + authService.currentUserValue?.role">
                {{ getRoleText(authService.currentUserValue?.role) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .dashboard-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      .dashboard-header h1 {
        color: #333;
        margin-bottom: 0.5rem;
      }
      .quick-actions {
        margin-bottom: 3rem;
      }
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }
      .action-card {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .action-card:hover {
        border-color: #007bff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
      }
      .action-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .action-card h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      .action-card p {
        color: #666;
        margin: 0;
        font-size: 0.875rem;
      }
      .stats-section {
        margin-bottom: 3rem;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }
      .stat-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .stat-icon {
        font-size: 2rem;
      }
      .stat-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        color: #666;
        font-weight: normal;
      }
      .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin: 0;
      }
      .recent-activity {
        margin-bottom: 3rem;
      }
      .activity-list {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f8f9fa;
      }
      .activity-item:last-child {
        border-bottom: none;
      }
      .activity-icon {
        font-size: 1.25rem;
      }
      .activity-content {
        flex: 1;
      }
      .activity-content p {
        margin: 0 0 0.25rem 0;
      }
      .activity-time {
        font-size: 0.875rem;
        color: #666;
      }
      .user-info {
        margin-bottom: 2rem;
      }
      .user-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-width: 400px;
      }
      .user-avatar {
        width: 60px;
        height: 60px;
        background: #007bff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .user-details h3 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }
      .user-email {
        color: #666;
        margin: 0 0 0.5rem 0;
      }
      .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .role-badge.admin {
        background: #dc3545;
        color: white;
      }
      .role-badge.moderator {
        background: #fd7e14;
        color: white;
      }
      .role-badge.journalist {
        background: #20c997;
        color: white;
      }
      .role-badge.registered_user {
        background: #6f42c1;
        color: white;
      }
      .role-badge.reader {
        background: #6c757d;
        color: white;
      }
    `,
  ],
})
export class DashboardComponent {
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
}
