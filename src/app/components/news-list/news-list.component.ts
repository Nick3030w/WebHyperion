import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';
import { NewsService } from '../../services/news.service'; // ← NUEVO
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
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
                (input)="onSearchChange()"
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
              <span class="stat-number">{{ totalNews }}</span>
              <span class="stat-label">Noticias</span>
            </div>
          </div>
          <div class="stat-card" *ngIf="authService.canComment()">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-number">{{ myCommentsCount }}</span>
              <span class="stat-label">Mis Comentarios</span>
            </div>
          </div>
          <div class="stat-card" *ngIf="authService.canCreateNews()">
            <div class="stat-icon">✏️</div>
            <div class="stat-info">
              <span class="stat-number">{{ myNewsCount }}</span>
              <span class="stat-label">Mis Noticias</span>
            </div>
          </div>
        </div>

        <!-- Grid de Noticias -->
        <div class="news-grid">
          <div *ngFor="let news of newsList" class="news-card">
            <div class="news-card-header">
              <span class="category-badge">{{ getCategoryDisplayName(news.category) }}</span>
              <span *ngIf="news.isBreakingNews" class="breaking-badge">🚨 Última Hora</span>
              <span
                *ngIf="news.status !== 'approved'"
                class="status-badge status-{{ news.status }}"
              >
                {{ getStatusText(news.status) }}
              </span>
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
                  <span class="comments">💬 {{ news.commentCount || 0 }}</span>
                </div>
              </div>
            </div>

            <div class="news-actions">
              <button (click)="viewNewsDetail(news._id!)" class="btn btn-outline btn-read">
                Leer más
              </button>
              <button
                *ngIf="authService.canComment()"
                (click)="quickComment(news)"
                class="btn btn-outline btn-comment"
              >
                Comentar
              </button>
              <button
                *ngIf="canEditNews(news)"
                (click)="editNews(news._id!)"
                class="btn btn-outline btn-edit"
              >
                ✏️ Editar
              </button>
              <button *ngIf="canDeleteNews(news)" (click)="deleteNews(news)" class="btn btn-danger">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="totalPages > 1" class="pagination">
          <button (click)="previousPage()" [disabled]="currentPage === 1" class="pagination-btn">
            ← Anterior
          </button>
          <span class="pagination-info"> Página {{ currentPage }} de {{ totalPages }} </span>
          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="pagination-btn"
          >
            Siguiente →
          </button>
        </div>

        <!-- Estados -->
        <div *ngIf="newsList.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">📰</div>
          <h3>No se encontraron noticias</h3>
          <p *ngIf="searchTerm || selectedCategory !== 'todas'">
            Intenta con otros términos de búsqueda o filtros
          </p>
          <p *ngIf="!searchTerm && selectedCategory === 'todas'">
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

        <div *ngIf="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando noticias...</p>
        </div>

        <!-- Modal de Confirmación -->
        <div *ngIf="showDeleteModal" class="modal-overlay">
          <div class="modal">
            <h3>¿Eliminar noticia?</h3>
            <p>¿Estás seguro de que quieres eliminar "{{ newsToDelete?.title }}"?</p>
            <div class="modal-actions">
              <button (click)="cancelDelete()" class="btn btn-secondary">Cancelar</button>
              <button (click)="confirmDelete()" class="btn btn-danger">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </app-layout>
  `,
  styles: [
    `
      /* ... (mantener todos los estilos anteriores) ... */

      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 500;
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

      .btn-danger {
        background: #dc3545;
        color: white;
        border: none;
      }

      .btn-danger:hover {
        background: #c82333;
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 2rem 0;
      }

      .pagination-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        background: white;
        border-radius: 5px;
        cursor: pointer;
      }

      .pagination-btn:disabled {
        background: #f8f9fa;
        color: #6c757d;
        cursor: not-allowed;
      }

      .pagination-info {
        color: #666;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
      }

      .modal h3 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .modal p {
        margin: 0 0 2rem 0;
        color: #666;
      }

      .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    `,
  ],
})
export class NewsListComponent implements OnInit {
  private router = inject(Router);
  private newsService = inject(NewsService); // ← NUEVO
  authService = inject(AuthService);

  newsList: News[] = [];
  filteredNews: News[] = [];
  searchTerm = '';
  selectedCategory = 'todas';
  loading = false;

  // Paginación
  currentPage = 1;
  totalPages = 1;
  totalNews = 0;
  myNewsCount = 0;
  myCommentsCount = 0;

  // Modal
  showDeleteModal = false;
  newsToDelete: News | null = null;

  categories = ['todas', 'tecnología', 'política', 'salud', 'economía', 'deportes', 'cultura'];

  ngOnInit() {
    this.loadNews();
  }

  // 🚀 CARGAR NOTICIAS DESDE EL BACKEND
  loadNews(): void {
    this.loading = true;
    this.newsService
      .getAllNews(
        this.currentPage,
        10,
        this.selectedCategory === 'todas' ? undefined : this.selectedCategory,
        this.searchTerm || undefined
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.newsList = Array.isArray(response.data) ? response.data : [response.data];
            this.totalNews = response.pagination?.totalItems || this.newsList.length;
            this.totalPages = response.pagination?.totalPages || 1;
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error cargando noticias:', error);
          alert('Error al cargar las noticias: ' + (error.error?.message || error.message));
        },
      });
  }

  // 🔧 FUNCIONALIDADES PRINCIPALES
  createNews(): void {
    this.router.navigate(['/create-news']);
  }

  goToModeration(): void {
    this.router.navigate(['/moderation']);
  }

  viewNewsDetail(newsId: string): void {
    this.router.navigate(['/news', newsId]);
  }

  quickComment(news: News): void {
    this.router.navigate(['/news', news._id]);
  }

  editNews(newsId: string): void {
    this.router.navigate(['/create-news'], { queryParams: { id: newsId } });
  }

  deleteNews(news: News): void {
    this.newsToDelete = news;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.newsToDelete = null;
  }

  confirmDelete(): void {
    if (this.newsToDelete?._id) {
      this.newsService.deleteNews(this.newsToDelete._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadNews(); // Recargar la lista
            alert('Noticia eliminada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error eliminando noticia:', error);
          alert('Error al eliminar la noticia: ' + (error.error?.message || error.message));
        },
      });
    }
    this.showDeleteModal = false;
    this.newsToDelete = null;
  }

  // 🔍 FILTROS Y BÚSQUEDA
  onSearchChange(): void {
    this.currentPage = 1;
    this.loadNews();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadNews();
  }

  // 📄 PAGINACIÓN
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadNews();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadNews();
    }
  }

  // ✅ VERIFICACIONES DE PERMISOS
  canEditNews(news: News): boolean {
    if (!this.authService.isLoggedIn()) return false;

    const user = this.authService.currentUserValue;
    if (!user) return false;

    // El autor puede editar sus propias noticias
    const isAuthor =
      typeof news.author === 'string' ? news.author === user._id : news.author._id === user._id;

    // Moderadores y admins pueden editar cualquier noticia
    const canModerate = this.authService.canModerate();

    return isAuthor || canModerate;
  }

  canDeleteNews(news: News): boolean {
    return this.canEditNews(news); // Mismas reglas que editar
  }

  // 🔧 FUNCIONES AUXILIARES
  getAuthorName(author: any): string {
    if (typeof author === 'object' && author.name) {
      return author.name;
    }
    return 'Anónimo';
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
