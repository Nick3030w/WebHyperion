import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { News } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="news-detail-container">
      <div *ngIf="news" class="news-detail">
        <article>
          <header class="news-header">
            <h1>{{ news.title }}</h1>
            <div class="news-meta">
              <span class="category">{{ news.category }}</span>
              <span class="date">{{ news.createdAt | date : 'fullDate' }}</span>
              <span class="views">👁️ {{ news.viewCount || 0 }} vistas</span>
            </div>
            <div class="news-actions" *ngIf="authService.canCreateNews()">
              <button class="btn-secondary">✏️ Editar</button>
              <button class="btn-danger">🗑️ Eliminar</button>
            </div>
          </header>

          <div class="news-content">
            <p>{{ news.content }}</p>
          </div>

          <footer class="news-footer">
            <div class="tags" *ngIf="news.tags && news.tags.length > 0">
              <strong>Etiquetas:</strong>
              <span *ngFor="let tag of news.tags" class="tag">{{ tag }}</span>
            </div>
          </footer>
        </article>

        <section class="comments-section">
          <h3>Comentarios</h3>

          <div *ngIf="authService.canComment()" class="comment-form">
            <textarea placeholder="Escribe tu comentario..." rows="4"></textarea>
            <button class="btn-primary">Enviar comentario</button>
          </div>
          <div *ngIf="!authService.isLoggedIn()" class="login-prompt">
            <p>
              <a routerLink="/login">Inicia sesión</a> o
              <a routerLink="/register">regístrate</a> para comentar
            </p>
          </div>

          <div class="comments-list">
            <div class="comment">
              <div class="comment-header">
                <strong>Usuario Ejemplo</strong>
                <span class="comment-date">Hace 2 horas</span>
              </div>
              <p>Excelente artículo, muy informativo.</p>
            </div>
          </div>
        </section>
      </div>

      <div *ngIf="!news" class="loading">
        <p>Cargando noticia...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .news-detail-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .news-header {
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 1rem;
      }
      .news-header h1 {
        margin: 0 0 1rem 0;
        color: #333;
      }
      .news-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
      }
      .category {
        background: #007bff;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
      }
      .date,
      .views {
        color: #666;
        font-size: 0.875rem;
      }
      .news-actions {
        display: flex;
        gap: 0.5rem;
      }
      .news-content {
        line-height: 1.8;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
      .news-footer {
        border-top: 1px solid #eee;
        padding-top: 1rem;
      }
      .tags {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .tag {
        background: #f8f9fa;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.875rem;
        border: 1px solid #dee2e6;
      }
      .comments-section {
        margin-top: 3rem;
      }
      .comment-form {
        margin-bottom: 2rem;
      }
      .comment-form textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 1rem;
        font-family: inherit;
      }
      .login-prompt {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 2rem;
      }
      .comments-list {
        space-y: 1rem;
      }
      .comment {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;
      }
      .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .comment-date {
        color: #666;
        font-size: 0.875rem;
      }
      .btn-primary,
      .btn-secondary,
      .btn-danger {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn-danger {
        background: #dc3545;
        color: white;
      }
      .loading {
        text-align: center;
        padding: 3rem;
        color: #666;
      }
    `,
  ],
})
export class NewsDetailComponent {
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  news: News | null = null;

  ngOnInit() {
    // Simular carga de noticia
    this.news = {
      _id: '1',
      title: 'Tecnología revoluciona la educación',
      content: `La inteligencia artificial está transformando la manera en que aprendemos. Desde plataformas adaptativas hasta tutores virtuales, la tecnología está haciendo la educación más accesible y personalizada que nunca.

      Estudios recientes muestran que los estudiantes que utilizan herramientas de IA tienen un 30% mejor retención de información y completan sus cursos un 40% más rápido.
      
      "Estamos viendo una revolución en la educación", comenta la Dra. María González, experta en tecnología educativa. "La IA permite adaptar el contenido a las necesidades específicas de cada estudiante."`,
      summary: 'Cómo la IA está cambiando la educación moderna',
      author: '1',
      category: 'tecnología',
      status: 'approved',
      viewCount: 150,
      tags: ['educación', 'tecnología', 'IA'],
      createdAt: new Date('2024-01-15'),
    };
  }
}
