import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { News } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="news-container">
      <div class="news-header">
        <h1>Últimas Noticias</h1>
        <button *ngIf="authService.canCreateNews()" routerLink="/create-news" class="btn-primary">
          📝 Crear Noticia
        </button>
      </div>

      <div class="news-grid">
        <div *ngFor="let news of newsList" class="news-card">
          <div class="news-image">
            <img [src]="news.images?.[0]?.url || '/assets/default-news.jpg'" [alt]="news.title" />
          </div>
          <div class="news-content">
            <h3>{{ news.title }}</h3>
            <p class="news-summary">
              {{ news.summary || (news.content | slice : 0 : 150) + '...' }}
            </p>
            <div class="news-meta">
              <span class="category">{{ news.category }}</span>
              <span class="date">{{ news.createdAt | date : 'mediumDate' }}</span>
              <span class="views">👁️ {{ news.viewCount || 0 }}</span>
            </div>
            <button [routerLink]="['/news', news._id]" class="btn-read-more">Leer más</button>
          </div>
        </div>
      </div>

      <div *ngIf="newsList.length === 0" class="no-news">
        <p>No hay noticias disponibles.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .news-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .news-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }
      .news-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease;
      }
      .news-card:hover {
        transform: translateY(-5px);
      }
      .news-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .news-content {
        padding: 1.5rem;
      }
      .news-content h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.25rem;
      }
      .news-summary {
        color: #666;
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      .news-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }
      .category {
        background: #007bff;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
      }
      .date,
      .views {
        color: #666;
      }
      .btn-primary,
      .btn-read-more {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      .btn-read-more {
        background: transparent;
        color: #007bff;
        border: 1px solid #007bff;
      }
      .no-news {
        text-align: center;
        padding: 3rem;
        color: #666;
      }
    `,
  ],
})
export class NewsListComponent implements OnInit {
  authService = inject(AuthService);

  newsList: News[] = [
    {
      _id: '1',
      title: 'Tecnología revoluciona la educación',
      content: 'La inteligencia artificial está transformando la manera en que aprendemos...',
      summary: 'Cómo la IA está cambiando la educación moderna',
      author: '1',
      category: 'tecnología',
      status: 'approved',
      viewCount: 150,
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: '2',
      title: 'Avances en medicina regenerativa',
      content: 'Nuevos descubrimientos en medicina regenerativa prometen...',
      summary: 'Descubrimientos recientes en medicina regenerativa',
      author: '2',
      category: 'salud',
      status: 'approved',
      viewCount: 89,
      createdAt: new Date('2024-01-14'),
    },
  ];

  ngOnInit() {
    // Aquí se conectaría con el servicio real
  }
}
