import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ← AGREGAR ESTA IMPORTACIÓN
import { News } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // ← AGREGAR FormsModule AQUÍ
    LayoutComponent,
  ],
  template: `
    <app-layout>
      <div class="news-container">
        <!-- Header Mejorado -->
        <div class="news-header">
          <div class="header-content">
            <h1 class="page-title">
              📰 Últimas Noticias
              <span class="subtitle">Mantente informado con contenido verificado</span>
            </h1>
            <div class="header-actions">
              <button
                *ngIf="authService.canCreateNews()"
                (click)="createNews()"
                class="btn btn-primary btn-with-icon"
              >
                <span class="icon">✏️</span>
                Crear Noticia
              </button>
              <button
                *ngIf="authService.canModerate()"
                (click)="goToModeration()"
                class="btn btn-secondary btn-with-icon"
              >
                <span class="icon">⚡</span>
                Moderar
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="filters-section">
            <div class="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar noticias..."
                [(ngModel)]="searchTerm"
                (input)="filterNews()"
                class="search-input"
              />
            </div>
            <div class="filter-buttons">
              <button
                *ngFor="let category of categories"
                (click)="filterByCategory(category)"
                [class.active]="selectedCategory === category"
                class="filter-btn"
              >
                {{ getCategoryDisplayName(category) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div *ngIf="authService.isLoggedIn()" class="quick-stats">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-number">{{ newsList.length }}</span>
              <span class="stat-label">Noticias</span>
            </div>
          </div>
          <div class="stat-card" *ngIf="authService.canComment()">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-number">{{ getMyCommentsCount() }}</span>
              <span class="stat-label">Mis Comentarios</span>
            </div>
          </div>
          <div class="stat-card" *ngIf="authService.canCreateNews()">
            <div class="stat-icon">✏️</div>
            <div class="stat-info">
              <span class="stat-number">{{ getMyNewsCount() }}</span>
              <span class="stat-label">Mis Noticias</span>
            </div>
          </div>
        </div>

        <!-- Grid de Noticias Mejorado -->
        <div class="news-grid">
          <div *ngFor="let news of filteredNews" class="news-card">
            <div class="news-card-header">
              <span class="category-badge">{{ getCategoryDisplayName(news.category) }}</span>
              <span *ngIf="news.isBreakingNews" class="breaking-badge">🚨 Última Hora</span>
            </div>

            <div class="news-image">
              <div class="image-placeholder">📰</div>
            </div>

            <div class="news-content">
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-summary">
                {{ news.summary || (news.content | slice : 0 : 120) + '...' }}
              </p>

              <div class="news-meta">
                <div class="meta-left">
                  <span class="author">Por {{ getAuthorName(news.author) }}</span>
                  <span class="date">{{ news.createdAt | date : 'mediumDate' }}</span>
                </div>
                <div class="meta-right">
                  <span class="views">👁️ {{ news.viewCount || 0 }}</span>
                  <span class="comments">💬 {{ getCommentCount(news._id) }}</span>
                </div>
              </div>
            </div>

            <div class="news-actions">
              <button (click)="viewNewsDetail(news._id)" class="btn btn-outline btn-read">
                Leer más
              </button>
              <button
                *ngIf="authService.canComment()"
                (click)="quickComment(news)"
                class="btn btn-outline btn-comment"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="filteredNews.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">📰</div>
          <h3>No se encontraron noticias</h3>
          <p *ngIf="searchTerm || selectedCategory">
            Intenta con otros términos de búsqueda o filtros
          </p>
          <p *ngIf="!searchTerm && !selectedCategory">
            No hay noticias disponibles en este momento
          </p>
          <button
            *ngIf="authService.canCreateNews()"
            (click)="createNews()"
            class="btn btn-primary"
          >
            Crear la primera noticia
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando noticias...</p>
        </div>
      </div>
    </app-layout>
  `,
  styles: [
    `
      .news-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      /* Header Mejorado */
      .news-header {
        margin-bottom: 2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }

      .page-title {
        margin: 0;
        color: #333;
        font-size: 2.5rem;
      }

      .subtitle {
        display: block;
        font-size: 1.1rem;
        color: #666;
        font-weight: normal;
        margin-top: 0.5rem;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      /* Filtros */
      .filters-section {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .search-box {
        margin-bottom: 1rem;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #007bff;
      }

      .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #e9ecef;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
      }

      .filter-btn:hover,
      .filter-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      /* Estadísticas */
      .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
      }

      .stat-icon {
        font-size: 2rem;
      }

      .stat-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: #007bff;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #666;
      }

      /* Grid de Noticias Mejorado */
      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .news-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .news-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .news-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem 0;
      }

      .category-badge {
        background: #007bff;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .breaking-badge {
        background: #dc3545;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 500;
      }

      .news-image {
        height: 200px;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .image-placeholder {
        font-size: 4rem;
        opacity: 0.8;
      }

      .news-content {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .news-title {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.25rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .news-summary {
        color: #666;
        line-height: 1.5;
        margin-bottom: 1.5rem;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .news-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        font-size: 0.875rem;
        color: #666;
      }

      .meta-left,
      .meta-right {
        display: flex;
        gap: 1rem;
      }

      .author {
        font-weight: 500;
      }

      .news-actions {
        padding: 0 1.5rem 1.5rem;
        display: flex;
        gap: 0.5rem;
      }

      /* Botones Mejorados */
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        font-size: 0.875rem;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
        transform: translateY(-1px);
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #545b62;
        transform: translateY(-1px);
      }

      .btn-outline {
        background: transparent;
        border: 2px solid #007bff;
        color: #007bff;
      }

      .btn-outline:hover {
        background: #007bff;
        color: white;
      }

      .btn-with-icon {
        padding: 0.75rem 1.25rem;
      }

      .btn-read,
      .btn-comment {
        flex: 1;
        justify-content: center;
      }

      /* Estados */
      .empty-state,
      .loading-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .empty-state p {
        color: #666;
        margin-bottom: 2rem;
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

      /* Responsive */
      @media (max-width: 768px) {
        .news-container {
          padding: 1rem;
        }

        .header-content {
          flex-direction: column;
          gap: 1rem;
        }

        .page-title {
          font-size: 2rem;
        }

        .header-actions {
          width: 100%;
          justify-content: center;
        }

        .news-grid {
          grid-template-columns: 1fr;
        }

        .news-meta {
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .meta-right {
          align-self: flex-end;
        }
      }
    `,
  ],
})
export class NewsListComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);

  newsList: News[] = [
    {
      _id: '1',
      title: 'Inteligencia Artificial revoluciona la medicina moderna',
      content:
        'Los últimos avances en IA están transformando el diagnóstico médico y el tratamiento de enfermedades. Hospitales alrededor del mundo están implementando sistemas de IA que pueden detectar patrones en imágenes médicas con una precisión superior al 95%.',
      summary:
        'Cómo la inteligencia artificial está mejorando la precisión en diagnósticos médicos y tratamientos personalizados.',
      author: '1',
      category: 'tecnología',
      status: 'approved',
      isBreakingNews: true,
      viewCount: 245,
      tags: ['IA', 'medicina', 'tecnología'],
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: '2',
      title: 'Energías renovables baten récords de producción en Latinoamérica',
      content:
        'La energía solar y eólica han alcanzado nuevos máximos históricos en países como Brasil, México y Chile. Inversiones por más de $50 billones están impulsando la transición energética en la región.',
      summary:
        'América Latina avanza en la transición energética con inversiones récord en fuentes renovables.',
      author: '2',
      category: 'economía',
      status: 'approved',
      viewCount: 189,
      tags: ['energía', 'medio ambiente', 'economía'],
      createdAt: new Date('2024-01-14'),
    },
    {
      _id: '3',
      title: 'Nueva ley de protección de datos afecta a empresas tecnológicas',
      content:
        'La legislación actualizada establece nuevos requisitos para el manejo de información personal. Las empresas tendrán 6 meses para adaptarse a las nuevas regulaciones que buscan proteger la privacidad de los usuarios.',
      summary:
        'Análisis de cómo la nueva ley de protección de datos impactará en las operaciones de empresas tecnológicas.',
      author: '3',
      category: 'política',
      status: 'approved',
      viewCount: 156,
      tags: ['ley', 'tecnología', 'privacidad'],
      createdAt: new Date('2024-01-13'),
    },
    {
      _id: '4',
      title: 'Avances en la investigación contra el cáncer muestran resultados prometedores',
      content:
        'Nuevos tratamientos experimentales han demostrado una efectividad del 80% en ensayos clínicos. Los investigadores esperanzados con los resultados preliminares.',
      summary:
        'Investigaciones recientes abren nuevas esperanzas en la lucha contra el cáncer con tratamientos innovadores.',
      author: '4',
      category: 'salud',
      status: 'approved',
      viewCount: 312,
      tags: ['cáncer', 'investigación', 'salud'],
      createdAt: new Date('2024-01-12'),
    },
  ];

  filteredNews: News[] = [];
  searchTerm = '';
  selectedCategory = 'todas';
  loading = false;

  categories = ['todas', 'tecnología', 'política', 'salud', 'economía', 'deportes', 'cultura'];

  ngOnInit() {
    this.filteredNews = [...this.newsList];
    this.simulateLoading();
  }

  // 🔧 FUNCIONALIDADES DE BOTONES

  createNews(): void {
    console.log('Navegando a crear noticia...');
    this.router.navigate(['/create-news']);
  }

  goToModeration(): void {
    console.log('Navegando a moderación...');
    this.router.navigate(['/moderation']);
  }

  viewNewsDetail(newsId: string | undefined): void {
    if (newsId) {
      console.log('Viendo detalle de noticia:', newsId);
      this.router.navigate(['/news', newsId]);
    }
  }

  quickComment(news: News): void {
    console.log('Comentando en noticia:', news._id);
    // Por ahora navegamos al detalle, después implementaremos comentario rápido
    this.router.navigate(['/news', news._id]);
  }

  filterNews(): void {
    if (!this.searchTerm.trim()) {
      this.applyCategoryFilter();
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredNews = this.newsList.filter(
      (news) =>
        (news.title.toLowerCase().includes(searchLower) ||
          news.summary?.toLowerCase().includes(searchLower) ||
          news.content.toLowerCase().includes(searchLower) ||
          news.tags?.some((tag) => tag.toLowerCase().includes(searchLower))) &&
        (this.selectedCategory === 'todas' || news.category === this.selectedCategory)
    );
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyCategoryFilter();
  }

  applyCategoryFilter(): void {
    if (this.selectedCategory === 'todas') {
      this.filteredNews = [...this.newsList];
    } else {
      this.filteredNews = this.newsList.filter((news) => news.category === this.selectedCategory);
    }
  }

  // 🔧 FUNCIONES AUXILIARES

  getAuthorName(author: any): string {
    const authorNames: { [key: string]: string } = {
      '1': 'Dr. Ana Martínez',
      '2': 'Carlos Rodríguez',
      '3': 'María González',
      '4': 'Equipo de Investigación',
    };
    return typeof author === 'string' ? authorNames[author] || 'Anónimo' : author.name || 'Anónimo';
  }

  getCommentCount(newsId: string | undefined): number {
    // Simulamos conteo de comentarios
    const counts: { [key: string]: number } = {
      '1': 12,
      '2': 8,
      '3': 5,
      '4': 15,
    };
    return newsId ? counts[newsId] || 0 : 0;
  }

  getMyNewsCount(): number {
    // Simulamos conteo de noticias del usuario actual
    return this.newsList.filter((news) => news.author === 'current-user').length;
  }

  getMyCommentsCount(): number {
    // Simulamos conteo de comentarios del usuario
    return 3; // Número simulado
  }

  getCategoryDisplayName(category: string): string {
    const displayNames: { [key: string]: string } = {
      todas: 'Todas',
      tecnología: 'Tecnología',
      política: 'Política',
      salud: 'Salud',
      economía: 'Economía',
      deportes: 'Deportes',
      cultura: 'Cultura',
    };
    return displayNames[category] || category;
  }

  simulateLoading(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
