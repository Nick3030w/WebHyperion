import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { News } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-news-container">
      <div class="page-header">
        <h1>Mis Noticias</h1>
        <button routerLink="/create-news" class="btn-primary">📝 Crear Nueva Noticia</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total</h3>
          <p class="stat-number">{{ newsList.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Publicadas</h3>
          <p class="stat-number published">{{ getNewsCount('approved') }}</p>
        </div>
        <div class="stat-card">
          <h3>En Revisión</h3>
          <p class="stat-number pending">{{ getNewsCount('pending_review') }}</p>
        </div>
        <div class="stat-card">
          <h3>Borradores</h3>
          <p class="stat-number draft">{{ getNewsCount('draft') }}</p>
        </div>
      </div>

      <div class="news-table">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Vistas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let news of newsList">
              <td class="title">{{ news.title }}</td>
              <td>
                <span [class]="'status-' + news.status" class="status-badge">
                  {{ getStatusText(news.status) }}
                </span>
              </td>
              <td>{{ news.category }}</td>
              <td>{{ news.createdAt | date : 'shortDate' }}</td>
              <td>{{ news.viewCount || 0 }}</td>
              <td class="actions">
                <button class="btn-small btn-primary">👁️</button>
                <button class="btn-small btn-secondary">✏️</button>
                <button class="btn-small btn-danger">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="newsList.length === 0" class="empty-state">
        <h3>No tienes noticias creadas</h3>
        <p>Crea tu primera noticia para comenzar a publicar</p>
        <button routerLink="/create-news" class="btn-primary">Crear Primera Noticia</button>
      </div>
    </div>
  `,
  styles: [
    `
      .my-news-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .stat-number {
        font-size: 2rem;
        font-weight: bold;
        margin: 0.5rem 0 0 0;
      }
      .stat-number.published {
        color: #28a745;
      }
      .stat-number.pending {
        color: #ffc107;
      }
      .stat-number.draft {
        color: #6c757d;
      }
      .news-table {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background: #f8f9fa;
        font-weight: 600;
      }
      .title {
        font-weight: 500;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .status-approved {
        background: #d4edda;
        color: #155724;
      }
      .status-pending_review {
        background: #fff3cd;
        color: #856404;
      }
      .status-draft {
        background: #e2e3e5;
        color: #383d41;
      }
      .status-rejected {
        background: #f8d7da;
        color: #721c24;
      }
      .actions {
        display: flex;
        gap: 0.25rem;
      }
      .btn-small {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.75rem;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .btn-primary {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
    `,
  ],
})
export class MyNewsComponent {
  authService = inject(AuthService);

  newsList: News[] = [
    {
      _id: '1',
      title: 'Tecnología revoluciona la educación',
      content: 'Contenido...',
      author: '1',
      category: 'tecnología',
      status: 'approved',
      viewCount: 150,
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: '2',
      title: 'Nuevo avance en inteligencia artificial',
      content: 'Contenido...',
      author: '1',
      category: 'tecnología',
      status: 'pending_review',
      viewCount: 0,
      createdAt: new Date('2024-01-16'),
    },
  ];

  getNewsCount(status: string): number {
    return this.newsList.filter((news) => news.status === status).length;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      draft: 'Borrador',
      pending_review: 'En Revisión',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      published: 'Publicada',
    };
    return statusMap[status] || status;
  }
}
