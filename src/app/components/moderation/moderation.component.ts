import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '../../models/news.model';
import { Comment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="moderation-container">
      <h1>Panel de Moderación</h1>

      <div class="moderation-tabs">
        <button
          class="tab-button"
          [class.active]="activeTab === 'news'"
          (click)="activeTab = 'news'"
        >
          📰 Noticias Pendientes ({{ pendingNews.length }})
        </button>
        <button
          class="tab-button"
          [class.active]="activeTab === 'comments'"
          (click)="activeTab = 'comments'"
        >
          💬 Comentarios Pendientes ({{ pendingComments.length }})
        </button>
      </div>

      <!-- Tab de Noticias -->
      <div *ngIf="activeTab === 'news'" class="tab-content">
        <div *ngFor="let news of pendingNews" class="moderation-item">
          <div class="item-content">
            <h3>{{ news.title }}</h3>
            <p class="summary">{{ news.summary }}</p>
            <div class="item-meta">
              <span><strong>Autor:</strong> {{ getAuthorName(news.author) }}</span>
              <span><strong>Categoría:</strong> {{ news.category }}</span>
              <span><strong>Fecha:</strong> {{ news.createdAt | date : 'short' }}</span>
            </div>
          </div>
          <div class="moderation-actions">
            <button class="btn-success" (click)="approveNews(news)">✅ Aprobar</button>
            <button class="btn-warning" (click)="openRejectModal(news)">❌ Rechazar</button>
            <button class="btn-secondary" (click)="viewDetails(news)">👁️ Ver</button>
          </div>
        </div>

        <div *ngIf="pendingNews.length === 0" class="empty-state">
          <p>No hay noticias pendientes de moderación</p>
        </div>
      </div>

      <!-- Tab de Comentarios -->
      <div *ngIf="activeTab === 'comments'" class="tab-content">
        <div *ngFor="let comment of pendingComments" class="moderation-item">
          <div class="item-content">
            <p class="comment-text">{{ comment.content }}</p>
            <div class="item-meta">
              <span><strong>Autor:</strong> {{ getAuthorName(comment.author) }}</span>
              <span><strong>Noticia:</strong> {{ getNewsTitle(comment.news) }}</span>
              <span><strong>Fecha:</strong> {{ comment.createdAt | date : 'short' }}</span>
            </div>
          </div>
          <div class="moderation-actions">
            <button class="btn-success" (click)="approveComment(comment)">✅ Aprobar</button>
            <button class="btn-warning" (click)="rejectComment(comment)">❌ Rechazar</button>
          </div>
        </div>

        <div *ngIf="pendingComments.length === 0" class="empty-state">
          <p>No hay comentarios pendientes de moderación</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .moderation-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
      }
      .moderation-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
      }
      .tab-button {
        padding: 1rem 1.5rem;
        border: none;
        background: none;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        font-size: 1rem;
      }
      .tab-button.active {
        border-bottom-color: #007bff;
        color: #007bff;
        font-weight: 500;
      }
      .moderation-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: white;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .item-content {
        flex: 1;
      }
      .item-content h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      .summary {
        color: #666;
        margin-bottom: 1rem;
      }
      .comment-text {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;
      }
      .item-meta {
        display: flex;
        gap: 1.5rem;
        font-size: 0.875rem;
        color: #666;
      }
      .moderation-actions {
        display: flex;
        gap: 0.5rem;
      }
      .btn-success,
      .btn-warning,
      .btn-secondary {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .btn-success {
        background: #28a745;
        color: white;
      }
      .btn-warning {
        background: #dc3545;
        color: white;
      }
      .btn-secondary {
        background: #6c757d;
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
export class ModerationComponent {
  authService = inject(AuthService);

  activeTab = 'news';

  pendingNews: News[] = [
    {
      _id: '1',
      title: 'Nuevo descubrimiento científico revolucionario',
      summary: 'Científicos descubren nueva tecnología que cambiará el mundo',
      content: 'Contenido...',
      author: '2',
      category: 'tecnología',
      status: 'pending_review',
      createdAt: new Date('2024-01-16'),
    },
  ];

  pendingComments: Comment[] = [
    {
      _id: '1',
      content: 'Excelente artículo, muy informativo y bien escrito',
      author: '3',
      news: '1',
      status: 'pending',
      createdAt: new Date('2024-01-16'),
    },
  ];

  getAuthorName(author: any): string {
    return typeof author === 'string' ? `Usuario ${author}` : author.name;
  }

  getNewsTitle(news: any): string {
    return typeof news === 'string' ? `Noticia ${news}` : news.title;
  }

  approveNews(news: News): void {
    console.log('Aprobando noticia:', news._id);
    // Lógica de aprobación
  }

  openRejectModal(news: News): void {
    console.log('Abriendo modal para rechazar:', news._id);
    // Lógica de rechazo
  }

  approveComment(comment: Comment): void {
    console.log('Aprobando comentario:', comment._id);
    // Lógica de aprobación
  }

  rejectComment(comment: Comment): void {
    console.log('Rechazando comentario:', comment._id);
    // Lógica de rechazo
  }

  viewDetails(news: News): void {
    console.log('Viendo detalles:', news._id);
    // Navegar a detalles
  }
}
