import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-comments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-comments-container">
      <div class="page-header">
        <h1>Mis Comentarios</h1>
        <p>Gestiona todos tus comentarios en un solo lugar</p>
      </div>

      <div class="comments-stats">
        <div class="stat-card">
          <h3>Total Comentarios</h3>
          <p class="stat-number">{{ comments.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Aprobados</h3>
          <p class="stat-number approved">{{ getCommentsCount('approved') }}</p>
        </div>
        <div class="stat-card">
          <h3>Pendientes</h3>
          <p class="stat-number pending">{{ getCommentsCount('pending') }}</p>
        </div>
        <div class="stat-card">
          <h3>Rechazados</h3>
          <p class="stat-number rejected">{{ getCommentsCount('rejected') }}</p>
        </div>
      </div>

      <div class="comments-list">
        <div *ngFor="let comment of comments" class="comment-card">
          <div class="comment-content">
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-meta">
              <span class="news-title">En: {{ getNewsTitle(comment.news) }}</span>
              <span class="comment-date">{{ comment.createdAt | date : 'medium' }}</span>
              <span [class]="'status-badge status-' + comment.status">
                {{ getStatusText(comment.status) }}
              </span>
            </div>
            <div *ngIf="comment.moderationNotes" class="moderation-notes">
              <strong>Notas del moderador:</strong> {{ comment.moderationNotes }}
            </div>
          </div>
          <div class="comment-actions">
            <button
              *ngIf="comment.status === 'pending' || comment.status === 'rejected'"
              class="btn-primary"
              (click)="editComment(comment)"
            >
              ✏️ Editar
            </button>
            <button class="btn-danger" (click)="deleteComment(comment)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>

      <div *ngIf="comments.length === 0" class="empty-state">
        <h3>No has realizado comentarios</h3>
        <p>Visita las noticias y comparte tus opiniones</p>
      </div>
    </div>
  `,
  styles: [
    `
      .my-comments-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .page-header {
        margin-bottom: 2rem;
      }
      .page-header h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      .comments-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .stat-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: #666;
        font-weight: normal;
      }
      .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }
      .stat-number.approved {
        color: #28a745;
      }
      .stat-number.pending {
        color: #ffc107;
      }
      .stat-number.rejected {
        color: #dc3545;
      }
      .comments-list {
        space-y: 1rem;
      }
      .comment-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }
      .comment-content {
        flex: 1;
      }
      .comment-text {
        margin: 0 0 1rem 0;
        line-height: 1.5;
        color: #333;
      }
      .comment-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
        font-size: 0.875rem;
        color: #666;
      }
      .news-title {
        font-weight: 500;
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
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      .status-rejected {
        background: #f8d7da;
        color: #721c24;
      }
      .status-flagged {
        background: #e2e3e5;
        color: #383d41;
      }
      .moderation-notes {
        background: #fff3cd;
        padding: 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
        font-size: 0.875rem;
      }
      .comment-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 100px;
      }
      .btn-primary,
      .btn-danger {
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.875rem;
        white-space: nowrap;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-danger {
        background: #dc3545;
        color: white;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: #666;
      }
    `,
  ],
})
export class MyCommentsComponent {
  authService = inject(AuthService);

  comments: Comment[] = [
    {
      _id: '1',
      content:
        'Excelente artículo, muy informativo y bien documentado. Me gustó especialmente la sección sobre los avances recientes.',
      author: 'current-user',
      news: '1',
      status: 'approved',
      createdAt: new Date('2024-01-15T10:30:00'),
      likes: ['user1', 'user2'],
    },
    {
      _id: '2',
      content: 'Interesante perspectiva, aunque me gustaría ver más datos sobre el tema.',
      author: 'current-user',
      news: '2',
      status: 'pending',
      createdAt: new Date('2024-01-16T14:20:00'),
    },
    {
      _id: '3',
      content: 'No estoy de acuerdo con algunos puntos presentados en el artículo.',
      author: 'current-user',
      news: '1',
      status: 'rejected',
      createdAt: new Date('2024-01-14T16:45:00'),
      moderationNotes:
        'Comentario considerado inapropiado por no respetar las normas de la comunidad.',
    },
  ];

  getCommentsCount(status: string): number {
    return this.comments.filter((comment) => comment.status === status).length;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      approved: 'Aprobado',
      pending: 'Pendiente',
      rejected: 'Rechazado',
      flagged: 'Marcado',
    };
    return statusMap[status] || status;
  }

  getNewsTitle(news: any): string {
    return typeof news === 'string' ? `Noticia ${news}` : news.title;
  }

  editComment(comment: Comment): void {
    console.log('Editando comentario:', comment._id);
    // Lógica para editar comentario
  }

  deleteComment(comment: Comment): void {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      console.log('Eliminando comentario:', comment._id);
      // Lógica para eliminar comentario
    }
  }
}
