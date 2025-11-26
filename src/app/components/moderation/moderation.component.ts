import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { News } from '../../models/news.model';
import { Comment } from '../../models/comment.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-moderation',
    standalone: true,
    imports: [CommonModule, LayoutComponent, FormsModule],
    template: `
        <app-layout>
            <div class="moderation-container">
                <h1>⚡ Panel de Moderación</h1>

                <div class="stats-overview">
                    <div class="stat-item">
                        <span class="stat-number">{{ pendingNewsCount }}</span>
                        <span class="stat-label">Noticias Pendientes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ pendingCommentsCount }}</span>
                        <span class="stat-label">Comentarios Pendientes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ moderatedToday }}</span>
                        <span class="stat-label">Moderados Hoy</span>
                    </div>
                </div>

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
                                <span><strong>Etiquetas:</strong> {{ news.tags?.join(', ') || 'Ninguna' }}</span>
                            </div>
                            <div class="news-content-preview">
                                <strong>Contenido:</strong>
                                <p>
                                    {{ news.content | slice : 0 : 200 }}{{ news.content.length > 200 ? '...' : '' }}
                                </p>
                            </div>
                        </div>
                        <div class="moderation-actions">
                            <button class="btn-success" (click)="approveNews(news)" [disabled]="loading">
                                ✅ Aprobar
                            </button>
                            <button class="btn-warning" (click)="openRejectModal(news)" [disabled]="loading">
                                ❌ Rechazar
                            </button>
                            <button
                                class="btn-secondary"
                                (click)="viewNewsDetails(news._id!)"
                                [disabled]="loading"
                            >
                                👁️ Ver Detalles
                            </button>
                        </div>
                    </div>

                    <div *ngIf="pendingNews.length === 0 && !loading" class="empty-state">
                        <p>🎉 No hay noticias pendientes de moderación</p>
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
                            <button class="btn-success" (click)="approveComment(comment)" [disabled]="loading">
                                ✅ Aprobar
                            </button>
                            <button class="btn-warning" (click)="rejectComment(comment)" [disabled]="loading">
                                ❌ Rechazar
                            </button>
                        </div>
                    </div>

                    <div *ngIf="pendingComments.length === 0 && !loading" class="empty-state">
                        <p>🎉 No hay comentarios pendientes de moderación</p>
                    </div>
                </div>

                <!-- Modal de Rechazo -->
                <div *ngIf="showRejectModal" class="modal-overlay">
                    <div class="modal">
                        <h3>¿Rechazar noticia?</h3>
                        <p>¿Estás seguro de que quieres rechazar "{{ newsToReject?.title }}"?</p>
                        <div class="form-group">
                            <label for="rejectReason">Razón del rechazo:</label>
                            <textarea
                                id="rejectReason"
                                [(ngModel)]="rejectReason"
                                placeholder="Explica por qué se rechaza esta noticia..."
                                rows="3"
                            ></textarea>
                        </div>
                        <div class="modal-actions">
                            <button (click)="cancelReject()" class="btn btn-secondary">Cancelar</button>
                            <button (click)="confirmReject()" class="btn btn-danger">Rechazar</button>
                        </div>
                    </div>
                </div>

                <div *ngIf="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Cargando contenido para moderación...</p>
                </div>
            </div>
        </app-layout>
    `,
    styles: [
        `
            .moderation-container {
                max-width: 1000px;
                margin: 0 auto;
                padding: 2rem;
            }
            .stats-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .stat-item {
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .stat-number {
                display: block;
                font-size: 2rem;
                font-weight: bold;
                color: #007bff;
            }
            .stat-label {
                font-size: 0.875rem;
                color: #666;
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
                margin-right: 1rem;
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
                flex-direction: column;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #666;
                margin-bottom: 1rem;
            }
            .news-content-preview {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 5px;
                font-size: 0.875rem;
            }
            .moderation-actions {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                min-width: 120px;
            }
            .btn-success,
            .btn-warning,
            .btn-secondary,
            .btn-danger {
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
            .btn-success:disabled {
                background: #a0a4a8;
            }
            .btn-warning {
                background: #dc3545;
                color: white;
            }
            .btn-warning:disabled {
                background: #a0a4a8;
            }
            .btn-secondary {
                background: #6c757d;
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
            .loading-state {
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
                max-width: 500px;
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
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-family: inherit;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        `,
    ],
})
export class ModerationComponent implements OnInit {
    private newsService = inject(NewsService);
    private commentService = inject(CommentService);
    authService = inject(AuthService);

    activeTab = 'news';
    loading = false;

    pendingNews: News[] = [];
    pendingComments: Comment[] = [];

    pendingNewsCount = 0;
    pendingCommentsCount = 0;
    moderatedToday = 0;

    // Modal
    showRejectModal = false;
    newsToReject: News | null = null;
    rejectReason = '';

    ngOnInit() {
        this.loadModerationData();
    }

    loadModerationData(): void {
        this.loading = true;

        // Cargar noticias pendientes
        this.newsService.getNewsForModeration().subscribe({
            next: (response) => {
                if (response.success) {
                    this.pendingNews = Array.isArray(response.data) ? response.data : [response.data];
                    this.pendingNewsCount = this.pendingNews.length;
                }
            },
            error: (error) => {
                console.error('Error cargando noticias:', error);
            },
        });

        // Cargar comentarios pendientes
        this.commentService.getCommentsForModeration().subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    this.pendingComments = Array.isArray(response.data) ? response.data : [response.data];
                    this.pendingCommentsCount = this.pendingComments.length;
                }
            },
            error: (error) => {
                this.loading = false;
                console.error('Error cargando comentarios:', error);
            },
        });
    }

    // 🔧 FUNCIONALIDADES DE MODERACIÓN

    approveNews(news: News): void {
        this.loading = true;
        this.newsService.reviewNews(news._id!, 'approved').subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    this.pendingNews = this.pendingNews.filter((n) => n._id !== news._id);
                    this.pendingNewsCount = this.pendingNews.length;
                    this.moderatedToday++;
                    alert('Noticia aprobada exitosamente');
                }
            },
            error: (error) => {
                this.loading = false;
                alert('Error al aprobar noticia: ' + (error.error?.message || error.message));
            },
        });
    }

    openRejectModal(news: News): void {
        this.newsToReject = news;
        this.showRejectModal = true;
    }

    cancelReject(): void {
        this.showRejectModal = false;
        this.newsToReject = null;
        this.rejectReason = '';
    }

    confirmReject(): void {
        if (this.newsToReject) {
            this.loading = true;
            this.newsService.reviewNews(this.newsToReject._id!, 'rejected', this.rejectReason).subscribe({
                next: (response) => {
                    this.loading = false;
                    if (response.success) {
                        this.pendingNews = this.pendingNews.filter((n) => n._id !== this.newsToReject!._id);
                        this.pendingNewsCount = this.pendingNews.length;
                        this.moderatedToday++;
                        this.showRejectModal = false;
                        this.newsToReject = null;
                        this.rejectReason = '';
                        alert('Noticia rechazada exitosamente');
                    }
                },
                error: (error) => {
                    this.loading = false;
                    alert('Error al rechazar noticia: ' + (error.error?.message || error.message));
                },
            });
        }
    }

    approveComment(comment: Comment): void {
        this.loading = true;
        this.commentService.moderateComment(comment._id!, 'approved').subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    this.pendingComments = this.pendingComments.filter((c) => c._id !== comment._id);
                    this.pendingCommentsCount = this.pendingComments.length;
                    this.moderatedToday++;
                    alert('Comentario aprobado exitosamente');
                }
            },
            error: (error) => {
                this.loading = false;
                alert('Error al aprobar comentario: ' + (error.error?.message || error.message));
            },
        });
    }

    rejectComment(comment: Comment): void {
        this.loading = true;
        this.commentService.moderateComment(comment._id!, 'rejected', 'inappropriate').subscribe({
            next: (response) => {
                this.loading = false;
                if (response.success) {
                    this.pendingComments = this.pendingComments.filter((c) => c._id !== comment._id);
                    this.pendingCommentsCount = this.pendingComments.length;
                    this.moderatedToday++;
                    alert('Comentario rechazado exitosamente');
                }
            },
            error: (error) => {
                this.loading = false;
                alert('Error al rechazar comentario: ' + (error.error?.message || error.message));
            },
        });
    }

    viewNewsDetails(newsId: string): void {
        // Navegar al detalle de la noticia
        window.open(`/news/${newsId}`, '_blank');
    }

    // 🔧 FUNCIONES AUXILIARES
    getAuthorName(author: any): string {
        if (typeof author === 'object' && author.name) {
            return author.name;
        }
        return 'Usuario';
    }

    getNewsTitle(news: any): string {
        if (typeof news === 'object' && news.title) {
            return news.title;
        }
        return 'Noticia';
    }
}
