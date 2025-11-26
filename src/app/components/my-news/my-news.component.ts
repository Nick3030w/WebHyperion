import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-my-news',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="my-news-container">
        <div class="page-header">
          <h1>📋 Mis Noticias</h1>
          <button routerLink="/create-news" class="btn btn-primary btn-with-icon">
            <span class="icon">✏️</span>
            Crear Nueva Noticia
          </button>
        </div>

        <!-- Estadísticas -->
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total</h3>
            <p class="stat-number">{{ totalNews }}</p>
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

        <!-- Filtros -->
        <div class="filters">
          <div class="filter-buttons">
            <button
              *ngFor="let filter of filters"
              (click)="setActiveFilter(filter.value)"
              [class.active]="activeFilter === filter.value"
              class="filter-btn"
            >
              {{ filter.label }} ({{ getNewsCount(filter.value) }})
            </button>
          </div>
        </div>

        <!-- Tabla de Noticias -->
        <div class="news-table-container">
          <table class="news-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Vistas</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let news of myNews">
                <td class="title-cell">
                  <div class="title-content">
                    <strong>{{ news.title }}</strong>
                    <div class="news-summary">
                      {{ news.summary | slice : 0 : 80
                      }}{{ news.summary && news.summary.length > 80 ? '...' : '' }}
                    </div>
                  </div>
                </td>
                <td>
                  <span [class]="'status-badge status-' + news.status">
                    {{ getStatusText(news.status) }}
                  </span>
                </td>
                <td>{{ getCategoryDisplayName(news.category) }}</td>
                <td>{{ news.createdAt | date : 'shortDate' }}</td>
                <td>{{ news.viewCount || 0 }}</td>
                <td>{{ news.commentCount || 0 }}</td>
                <td class="actions-cell">
                  <button (click)="viewNews(news._id!)" class="btn-icon" title="Ver noticia">
                    👁️
                  </button>
                  <button
                    *ngIf="canEdit(news)"
                    (click)="editNews(news._id!)"
                    class="btn-icon"
                    title="Editar noticia"
                  >
                    ✏️
                  </button>
                  <button
                    *ngIf="canDelete(news)"
                    (click)="deleteNews(news)"
                    class="btn-icon btn-danger"
                    title="Eliminar noticia"
                  >
                    🗑️
                  </button>
                  <button
                    *ngIf="news.status === 'draft'"
                    (click)="submitForReview(news)"
                    class="btn-icon btn-success"
                    title="Enviar para revisión"
                  >
                    📤
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Estado vacío -->
          <div *ngIf="myNews.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">📰</div>
            <h3>No tienes noticias {{ getActiveFilterText() }}</h3>
            <p *ngIf="activeFilter === 'all'">Comienza creando tu primera noticia</p>
            <p *ngIf="activeFilter !== 'all'">No hay noticias con este estado</p>
            <button routerLink="/create-news" class="btn btn-primary">Crear Primera Noticia</button>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Cargando tus noticias...</p>
          </div>
        </div>

        <!-- Modal de Confirmación -->
        <div *ngIf="showDeleteModal" class="modal-overlay">
          <div class="modal">
            <h3>¿Eliminar noticia?</h3>
            <p>¿Estás seguro de que quieres eliminar "{{ newsToDelete?.title }}"?</p>
            <p class="warning-text">Esta acción no se puede deshacer.</p>
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
      .page-header h1 {
        margin: 0;
        color: #333;
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
      .stat-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: #666;
        font-weight: normal;
      }
      .stat-number {
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
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
      .filters {
        margin-bottom: 2rem;
      }
      .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .filter-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid #e9ecef;
        background: white;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .filter-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }
      .news-table-container {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .news-table {
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
        color: #333;
      }
      .title-cell {
        max-width: 300px;
      }
      .title-content strong {
        display: block;
        margin-bottom: 0.25rem;
      }
      .news-summary {
        font-size: 0.875rem;
        color: #666;
        line-height: 1.4;
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
      .actions-cell {
        display: flex;
        gap: 0.25rem;
        min-width: 160px;
      }
      .btn-icon {
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.875rem;
        background: #f8f9fa;
      }
      .btn-icon:hover {
        background: #e9ecef;
      }
      .btn-icon.btn-danger {
        background: #dc3545;
        color: white;
      }
      .btn-icon.btn-danger:hover {
        background: #c82333;
      }
      .btn-icon.btn-success {
        background: #28a745;
        color: white;
      }
      .btn-icon.btn-success:hover {
        background: #218838;
      }
      .empty-state,
      .loading-state {
        text-align: center;
        padding: 3rem;
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
        margin: 0 0 1rem 0;
        color: #666;
      }
      .warning-text {
        color: #dc3545 !important;
        font-weight: 500;
      }
      .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
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
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn-danger {
        background: #dc3545;
        color: white;
      }
      .btn-with-icon {
        padding: 0.75rem 1.25rem;
      }
      @media (max-width: 768px) {
        .my-news-container {
          padding: 1rem;
        }
        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .news-table {
          font-size: 0.875rem;
        }
        .actions-cell {
          flex-direction: column;
          min-width: auto;
        }
      }
    `,
  ],
})
export class MyNewsComponent implements OnInit {
  private router = inject(Router);
  private newsService = inject(NewsService);
  authService = inject(AuthService);

  myNews: News[] = [];
  loading = false;
  totalNews = 0;

  // Filtros
  filters = [
    { value: 'all', label: 'Todas' },
    { value: 'draft', label: 'Borradores' },
    { value: 'pending_review', label: 'En Revisión' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'rejected', label: 'Rechazadas' },
  ];
  activeFilter = 'all';

  // Modal
  showDeleteModal = false;
  newsToDelete: News | null = null;

  ngOnInit() {
    this.loadMyNews();
  }

  loadMyNews(): void {
    this.loading = true;
    this.newsService.getMyNews().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.myNews = Array.isArray(response.data) ? response.data : [response.data];
          this.totalNews = this.myNews.length;
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error cargando mis noticias:', error);
        alert('Error al cargar tus noticias: ' + (error.error?.message || error.message));
      },
    });
  }

  // 🔧 FUNCIONALIDADES PRINCIPALES
  viewNews(newsId: string): void {
    this.router.navigate(['/news', newsId]);
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
            this.loadMyNews(); // Recargar la lista
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

  submitForReview(news: News): void {
    if (!news._id) return;

    const newsData: Partial<News> = {
      status: 'pending_review' as 'pending_review',
    };

    this.newsService.updateNews(news._id, newsData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadMyNews(); // Recargar la lista
          alert('Noticia enviada para revisión exitosamente');
        }
      },
      error: (error) => {
        console.error('Error enviando noticia:', error);
        alert('Error al enviar noticia: ' + (error.error?.message || error.message));
      },
    });
  }

  // 🔍 FILTROS
  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
    // El filtrado se hace en el getter filteredNews
  }

  get filteredNews(): News[] {
    if (this.activeFilter === 'all') {
      return this.myNews;
    }
    return this.myNews.filter((news) => news.status === this.activeFilter);
  }

  getNewsCount(status: string): number {
    if (status === 'all') return this.myNews.length;
    return this.myNews.filter((news) => news.status === status).length;
  }

  // ✅ VERIFICACIONES DE PERMISOS
  canEdit(news: News): boolean {
    if (!this.authService.isLoggedIn()) return false;

    const user = this.authService.currentUserValue;
    if (!user) return false;

    // El autor puede editar sus propias noticias
    const isAuthor =
      typeof news.author === 'string' ? news.author === user._id : news.author._id === user._id;

    return isAuthor;
  }

  canDelete(news: News): boolean {
    return this.canEdit(news); // Mismas reglas que editar
  }

  // 🔧 FUNCIONES AUXILIARES
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

  getActiveFilterText(): string {
    const filter = this.filters.find((f) => f.value === this.activeFilter);
    return filter ? filter.label.toLowerCase() : '';
  }
}
