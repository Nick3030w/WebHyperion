import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../services/news.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { News } from '../../models/news.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="news-detail-container">
        <!-- Noticia Principal -->
        <div *ngIf="news" class="news-detail">
          <article class="news-article">
            <header class="news-header">
              <div class="news-meta">
                <span class="category-badge">{{ getCategoryDisplayName(news.category) }}</span>
                <span *ngIf="news.isBreakingNews" class="breaking-badge">🚨 Última Hora</span>
                <span class="date">{{ news.createdAt | date : 'fullDate' }}</span>
                <span class="views">👁️ {{ news.viewCount || 0 }} vistas</span>
              </div>

              <h1 class="news-title">{{ news.title }}</h1>

              <div class="author-section">
                <div class="author-avatar">
                  {{ getAuthorName(news.author)?.charAt(0) }}
                </div>
                <div class="author-info">
                  <strong>Por {{ getAuthorName(news.author) }}</strong>
                  <span>Publicado el {{ news.createdAt | date : 'medium' }}</span>
                </div>
              </div>

              <div *ngIf="news.summary" class="news-summary">
                {{ news.summary }}
              </div>

              <div class="news-actions" *ngIf="authService.canCreateNews()">
                <button *ngIf="canEditNews()" (click)="editNews()" class="btn btn-secondary">
                  ✏️ Editar Noticia
                </button>
                <button *ngIf="canDeleteNews()" (click)="deleteNews()" class="btn btn-danger">
                  🗑️ Eliminar
                </button>
              </div>
            </header>

            <div class="news-content">
              <p>{{ news.content }}</p>
            </div>

            <footer class="news-footer">
              <div *ngIf="news.tags && news.tags.length > 0" class="tags-section">
                <strong>Etiquetas:</strong>
                <div class="tags-list">
                  <span *ngFor="let tag of news.tags" class="tag">{{ tag }}</span>
                </div>
              </div>

              <div *ngIf="news.sources && news.sources.length > 0" class="sources-section">
                <strong>Fuentes:</strong>
                <ul class="sources-list">
                  <li *ngFor="let source of news.sources">
                    <a [href]="source.url" target="_blank" class="source-link">{{ source.name }}</a>
                  </li>
                </ul>
              </div>
            </footer>
          </article>

          <!-- Sección de Comentarios -->
          <section class="comments-section">
            <div class="comments-header">
              <h2>💬 Comentarios ({{ comments.length }})</h2>
              <button
                *ngIf="!showCommentForm"
                (click)="showCommentForm = true"
                class="btn btn-primary"
                [disabled]="!authService.canComment()"
              >
                ✍️ Agregar Comentario
              </button>
            </div>

            <!-- Formulario de Comentario -->
            <div *ngIf="showCommentForm" class="comment-form">
              <textarea
                [(ngModel)]="newComment"
                placeholder="Escribe tu comentario..."
                rows="4"
                maxlength="1000"
                class="comment-textarea"
              ></textarea>
              <div class="comment-form-actions">
                <small class="char-count">{{ newComment.length }}/1000</small>
                <div class="actions">
                  <button (click)="cancelComment()" class="btn btn-secondary">Cancelar</button>
                  <button
                    (click)="submitComment()"
                    [disabled]="!newComment.trim() || submittingComment"
                    class="btn btn-primary"
                  >
                    {{ submittingComment ? 'Enviando...' : 'Enviar Comentario' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de Comentarios -->
            <div class="comments-list">
              <div *ngFor="let comment of comments" class="comment">
                <div class="comment-header">
                  <div class="comment-author">
                    <div class="author-avatar small">
                      {{ getAuthorName(comment.author)?.charAt(0) }}
                    </div>
                    <div class="author-info">
                      <strong>{{ getAuthorName(comment.author) }}</strong>
                      <span class="comment-date">{{ comment.createdAt | date : 'medium' }}</span>
                    </div>
                  </div>
                  <div class="comment-actions" *ngIf="canModerateComment(comment)">
                    <button
                      (click)="approveComment(comment)"
                      class="btn-icon"
                      title="Aprobar comentario"
                    >
                      ✅
                    </button>
                    <button
                      (click)="rejectComment(comment)"
                      class="btn-icon"
                      title="Rechazar comentario"
                    >
                      ❌
                    </button>
                  </div>
                </div>

                <div class="comment-content">
                  <p>{{ comment.content }}</p>
                </div>

                <div class="comment-footer">
                  <div class="comment-reactions">
                    <button
                      (click)="reactToComment(comment, 'like')"
                      class="reaction-btn"
                      [class.active]="hasLiked(comment)"
                    >
                      👍 {{ comment.likes?.length || 0 }}
                    </button>
                    <button
                      (click)="reactToComment(comment, 'dislike')"
                      class="reaction-btn"
                      [class.active]="hasDisliked(comment)"
                    >
                      👎 {{ comment.dislikes?.length || 0 }}
                    </button>
                  </div>

                  <div class="comment-status" *ngIf="comment.status !== 'approved'">
                    <span [class]="'status-badge status-' + comment.status">
                      {{ getCommentStatusText(comment.status) }}
                    </span>
                  </div>
                </div>

                <!-- Respuestas -->
                <div *ngIf="comment.replies && comment.replies.length > 0" class="replies">
                  <div *ngFor="let reply of comment.replies" class="reply">
                    <div class="comment-header">
                      <div class="comment-author">
                        <div class="author-avatar small">
                          {{ getAuthorName(reply.author)?.charAt(0) }}
                        </div>
                        <div class="author-info">
                          <strong>{{ getAuthorName(reply.author) }}</strong>
                          <span class="comment-date">{{ reply.createdAt | date : 'medium' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="comment-content">
                      <p>{{ reply.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div *ngIf="comments.length === 0" class="empty-comments">
              <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
          </section>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando noticia...</p>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="error-state">
          <h3>Error al cargar la noticia</h3>
          <p>{{ error }}</p>
          <button routerLink="/news" class="btn btn-primary">Volver a Noticias</button>
        </div>
      </div>
    </app-layout>
  `,
  styles: [
    `
      .news-detail-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .news-article {
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }
      .news-header {
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 1rem;
      }
      .news-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .category-badge {
        background: #007bff;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .breaking-badge {
        background: #dc3545;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .date,
      .views {
        color: #666;
        font-size: 0.875rem;
      }
      .news-title {
        font-size: 2.5rem;
        margin: 0 0 1.5rem 0;
        color: #333;
        line-height: 1.2;
      }
      .author-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .author-avatar {
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.25rem;
      }
      .author-avatar.small {
        width: 35px;
        height: 35px;
        font-size: 1rem;
      }
      .author-info {
        line-height: 1.4;
      }
      .author-info strong {
        display: block;
        color: #333;
      }
      .author-info span {
        font-size: 0.875rem;
        color: #666;
      }
      .news-summary {
        font-size: 1.125rem;
        color: #666;
        line-height: 1.6;
        font-style: italic;
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1.5rem;
      }
      .news-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .news-content {
        line-height: 1.8;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
      .news-content p {
        margin-bottom: 1.5rem;
      }
      .news-footer {
        border-top: 1px solid #eee;
        padding-top: 1.5rem;
      }
      .tags-section,
      .sources-section {
        margin-bottom: 1.5rem;
      }
      .tags-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
      }
      .tag {
        background: #f8f9fa;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
        border: 1px solid #dee2e6;
      }
      .sources-list {
        margin: 0.5rem 0 0 1rem;
        padding: 0;
      }
      .source-link {
        color: #007bff;
        text-decoration: none;
      }
      .source-link:hover {
        text-decoration: underline;
      }
      .comments-section {
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .comments-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 1rem;
      }
      .comments-header h2 {
        margin: 0;
        color: #333;
      }
      .comment-form {
        margin-bottom: 2rem;
      }
      .comment-textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: inherit;
        resize: vertical;
      }
      .comment-form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
      }
      .char-count {
        color: #666;
        font-size: 0.875rem;
      }
      .comment-form .actions {
        display: flex;
        gap: 0.5rem;
      }
      .comments-list {
        space-y: 1rem;
      }
      .comment {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
      }
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }
      .comment-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .comment-actions {
        display: flex;
        gap: 0.25rem;
      }
      .btn-icon {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        background: #f8f9fa;
      }
      .btn-icon:hover {
        background: #e9ecef;
      }
      .comment-content {
        margin-bottom: 1rem;
      }
      .comment-content p {
        margin: 0;
        line-height: 1.6;
      }
      .comment-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .comment-reactions {
        display: flex;
        gap: 0.5rem;
      }
      .reaction-btn {
        padding: 0.25rem 0.75rem;
        border: 1px solid #ddd;
        background: white;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .reaction-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }
      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      .status-rejected {
        background: #f8d7da;
        color: #721c24;
      }
      .replies {
        margin-left: 3rem;
        margin-top: 1rem;
        border-left: 3px solid #e9ecef;
        padding-left: 1rem;
      }
      .reply {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 0.5rem;
      }
      .empty-comments {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
      .loading-state,
      .error-state {
        text-align: center;
        padding: 3rem;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-primary:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn-danger {
        background: #dc3545;
        color: white;
      }
      @media (max-width: 768px) {
        .news-detail-container {
          padding: 1rem;
        }
        .news-article,
        .comments-section {
          padding: 1.5rem;
        }
        .news-title {
          font-size: 2rem;
        }
        .comments-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .comment-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .comment-footer {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .replies {
          margin-left: 1rem;
        }
      }
    `,
  ],
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);
  private commentService = inject(CommentService);
  authService = inject(AuthService);

  news: News | null = null;
  comments: Comment[] = [];
  loading = false;
  error = '';

  // Comentarios
  showCommentForm = false;
  newComment = '';
  submittingComment = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const newsId = params['id'];
      if (newsId) {
        this.loadNews(newsId);
        this.loadComments(newsId);
      }
    });
  }

  loadNews(newsId: string): void {
    this.loading = true;
    this.newsService.getNewsById(newsId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          this.news = Array.isArray(response.data) ? response.data[0] : response.data;
        } else {
          this.error = 'No se pudo cargar la noticia';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar la noticia: ' + (error.error?.message || error.message);
      },
    });
  }

  loadComments(newsId: string): void {
    this.commentService.getNewsComments(newsId).subscribe({
      next: (response) => {
        if (response.success) {
          this.comments = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        console.error('Error cargando comentarios:', error);
      },
    });
  }

  // 🔧 FUNCIONALIDADES DE NOTICIA
  editNews(): void {
    if (this.news?._id) {
      this.router.navigate(['/create-news'], { queryParams: { id: this.news._id } });
    }
  }

  deleteNews(): void {
    if (this.news?._id && confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      this.newsService.deleteNews(this.news._id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Noticia eliminada exitosamente');
            this.router.navigate(['/news']);
          }
        },
        error: (error) => {
          alert('Error al eliminar noticia: ' + (error.error?.message || error.message));
        },
      });
    }
  }

  // 🔧 FUNCIONALIDADES DE COMENTARIOS
  submitComment(): void {
    if (!this.news?._id || !this.newComment.trim()) return;

    this.submittingComment = true;
    this.commentService
      .createComment({
        content: this.newComment,
        newsId: this.news._id,
      })
      .subscribe({
        next: (response) => {
          this.submittingComment = false;
          if (response.success) {
            this.newComment = '';
            this.showCommentForm = false;
            this.loadComments(this.news!._id!);
            alert('Comentario enviado para moderación');
          }
        },
        error: (error) => {
          this.submittingComment = false;
          alert('Error al enviar comentario: ' + (error.error?.message || error.message));
        },
      });
  }

  cancelComment(): void {
    this.showCommentForm = false;
    this.newComment = '';
  }

  reactToComment(comment: Comment, reaction: 'like' | 'dislike'): void {
    if (!comment._id) return;

    this.commentService.reactToComment(comment._id, reaction).subscribe({
      next: (response) => {
        // Recargar comentarios para ver los cambios
        if (this.news?._id) {
          this.loadComments(this.news._id);
        }
      },
      error: (error) => {
        console.error('Error al reaccionar:', error);
      },
    });
  }

  approveComment(comment: Comment): void {
    if (!comment._id) return;

    this.commentService.moderateComment(comment._id, 'approved').subscribe({
      next: (response) => {
        if (response.success && this.news?._id) {
          this.loadComments(this.news._id);
        }
      },
      error: (error) => {
        alert('Error al aprobar comentario: ' + (error.error?.message || error.message));
      },
    });
  }

  rejectComment(comment: Comment): void {
    if (!comment._id) return;

    this.commentService.moderateComment(comment._id, 'rejected', 'inappropriate').subscribe({
      next: (response) => {
        if (response.success && this.news?._id) {
          this.loadComments(this.news._id);
        }
      },
      error: (error) => {
        alert('Error al rechazar comentario: ' + (error.error?.message || error.message));
      },
    });
  }

  // ✅ VERIFICACIONES DE PERMISOS
  canEditNews(): boolean {
    if (!this.news || !this.authService.isLoggedIn()) return false;

    const user = this.authService.currentUserValue;
    if (!user) return false;

    // El autor puede editar sus propias noticias
    const isAuthor =
      typeof this.news.author === 'string'
        ? this.news.author === user._id
        : this.news.author._id === user._id;

    // Moderadores y admins pueden editar cualquier noticia
    const canModerate = this.authService.canModerate();

    return isAuthor || canModerate;
  }

  canDeleteNews(): boolean {
    return this.canEditNews();
  }

  canModerateComment(comment: Comment): boolean {
    return this.authService.canModerate();
  }

  hasLiked(comment: Comment): boolean {
    // Simulación - en una app real verificarías el usuario actual
    return false;
  }

  hasDisliked(comment: Comment): boolean {
    // Simulación - en una app real verificarías el usuario actual
    return false;
  }

  // 🔧 FUNCIONES AUXILIARES
  getAuthorName(author: any): string {
    if (typeof author === 'object' && author.name) {
      return author.name;
    }
    return 'Usuario';
  }

  getCategoryDisplayName(category: string): string {
    const displayNames: { [key: string]: string } = {
      tecnología: 'Tecnología',
      política: 'Política',
      salud: 'Salud',
      economía: 'Economía',
      deportes: 'Deportes',
      cultura: 'Cultura',
      internacional: 'Internacional',
      otros: 'Otros',
    };
    return displayNames[category] || category;
  }

  getCommentStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      flagged: 'Marcado',
    };
    return statusMap[status] || status;
  }
}
