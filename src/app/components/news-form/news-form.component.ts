import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { News } from '../../models/news.model'; // ← Asegúrate de importar News

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="form-container">
        <div class="form-card">
          <h2>{{ isEdit ? 'Editar Noticia' : 'Crear Nueva Noticia' }}</h2>

          <form [formGroup]="newsForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="title">Título *</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="Título de la noticia"
                [class.error]="newsForm.get('title')?.invalid && newsForm.get('title')?.touched"
              />
              <div
                *ngIf="newsForm.get('title')?.invalid && newsForm.get('title')?.touched"
                class="error-message"
              >
                Título es requerido (mínimo 10 caracteres)
              </div>
            </div>

            <div class="form-group">
              <label for="summary">Resumen</label>
              <textarea
                id="summary"
                formControlName="summary"
                placeholder="Breve resumen de la noticia..."
                rows="3"
                maxlength="300"
              ></textarea>
              <small class="char-count"
                >{{ newsForm.get('summary')?.value?.length || 0 }}/300</small
              >
            </div>

            <div class="form-group">
              <label for="content">Contenido *</label>
              <textarea
                id="content"
                formControlName="content"
                placeholder="Contenido completo de la noticia..."
                rows="10"
                [class.error]="newsForm.get('content')?.invalid && newsForm.get('content')?.touched"
              ></textarea>
              <div
                *ngIf="newsForm.get('content')?.invalid && newsForm.get('content')?.touched"
                class="error-message"
              >
                Contenido es requerido (mínimo 50 caracteres)
              </div>
              <small class="char-count"
                >{{ newsForm.get('content')?.value?.length || 0 }} caracteres</small
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Categoría *</label>
                <select
                  id="category"
                  formControlName="category"
                  [class.error]="
                    newsForm.get('category')?.invalid && newsForm.get('category')?.touched
                  "
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="política">Política</option>
                  <option value="salud">Salud</option>
                  <option value="tecnología">Tecnología</option>
                  <option value="deportes">Deportes</option>
                  <option value="economía">Economía</option>
                  <option value="cultura">Cultura</option>
                  <option value="internacional">Internacional</option>
                  <option value="otros">Otros</option>
                </select>
                <div
                  *ngIf="newsForm.get('category')?.invalid && newsForm.get('category')?.touched"
                  class="error-message"
                >
                  Categoría es requerida
                </div>
              </div>

              <div class="form-group">
                <label for="tags">Etiquetas</label>
                <input
                  id="tags"
                  type="text"
                  formControlName="tags"
                  placeholder="tecnología, innovación, educación"
                />
                <small class="form-text">Separar con comas</small>
              </div>
            </div>

            <div class="form-check">
              <input type="checkbox" id="isBreakingNews" formControlName="isBreakingNews" />
              <label for="isBreakingNews">🚨 Noticia de última hora</label>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn-secondary"
                (click)="onSaveDraft()"
                [disabled]="newsForm.invalid"
              >
                💾 Guardar Borrador
              </button>
              <button type="submit" class="btn-primary" [disabled]="newsForm.invalid || loading">
                {{
                  loading
                    ? 'Enviando...'
                    : isEdit
                    ? 'Actualizar Noticia'
                    : '📤 Enviar para Revisión'
                }}
              </button>
            </div>

            <div *ngIf="error" class="error-message server-error">
              {{ error }}
            </div>

            <div *ngIf="success" class="success-message">
              {{ success }}
            </div>
          </form>
        </div>
      </div>
    </app-layout>
  `,
  styles: [
    `
      .form-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .form-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      input,
      select,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        font-family: inherit;
      }
      input.error,
      select.error,
      textarea.error {
        border-color: #e74c3c;
      }
      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .server-error {
        background: #ffeaea;
        padding: 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
      }
      .success-message {
        color: #27ae60;
        background: #e8f6ef;
        padding: 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
      }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .form-check {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      .form-check input {
        width: auto;
      }
      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
      .btn-primary,
      .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
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
      .btn-secondary:disabled {
        background: #a0a4a8;
        cursor: not-allowed;
      }
      .form-text {
        font-size: 0.875rem;
        color: #6c757d;
        margin-top: 0.25rem;
        display: block;
      }
      .char-count {
        font-size: 0.75rem;
        color: #666;
        text-align: right;
        display: block;
        margin-top: 0.25rem;
      }
      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }
        .form-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class NewsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  authService = inject(AuthService);

  newsForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  isEdit = false;
  newsId: string | null = null;

  constructor() {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.maxLength(300)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', [Validators.required]],
      tags: [''],
      isBreakingNews: [false],
    });
  }

  ngOnInit() {
    // Verificar si estamos editando
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.newsId = params['id'];
        this.loadNewsForEdit();
      }
    });
  }

  loadNewsForEdit(): void {
    if (!this.newsId) return;

    this.loading = true;
    this.newsService.getNewsById(this.newsId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          const news = Array.isArray(response.data) ? response.data[0] : response.data;

          // Verificar permisos para editar
          if (!this.canEditNews(news)) {
            this.error = 'No tienes permisos para editar esta noticia';
            return;
          }

          // Llenar el formulario con los datos existentes
          this.newsForm.patchValue({
            title: news.title,
            summary: news.summary,
            content: news.content,
            category: news.category,
            tags: news.tags?.join(', '),
            isBreakingNews: news.isBreakingNews || false,
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al cargar la noticia: ' + (error.error?.message || error.message);
      },
    });
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = this.newsForm.value;

      // CORREGIDO: Especificar el tipo del status
      const newsData: Partial<News> = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        isBreakingNews: formData.isBreakingNews,
        status: 'pending_review' as 'pending_review', // ← TIPO ESPECÍFICO
      };

      if (this.isEdit && this.newsId) {
        // Actualizar noticia existente
        this.newsService.updateNews(this.newsId, newsData).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success) {
              this.success = 'Noticia actualizada y enviada para revisión';
              setTimeout(() => {
                this.router.navigate(['/my-news']);
              }, 2000);
            }
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Error al actualizar noticia: ' + (error.error?.message || error.message);
          },
        });
      } else {
        // Crear nueva noticia
        this.newsService.createNews(newsData).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success) {
              this.success = 'Noticia creada y enviada para revisión exitosamente';
              setTimeout(() => {
                this.router.navigate(['/my-news']);
              }, 2000);
            }
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Error al crear noticia: ' + (error.error?.message || error.message);
          },
        });
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.newsForm.controls).forEach((key) => {
        this.newsForm.get(key)?.markAsTouched();
      });
    }
  }

  onSaveDraft(): void {
    if (this.newsForm.valid) {
      const formData = this.newsForm.value;

      // CORREGIDO: Especificar el tipo del status
      const newsData: Partial<News> = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        isBreakingNews: formData.isBreakingNews,
        status: 'draft' as 'draft', // ← TIPO ESPECÍFICO
      };

      if (this.isEdit && this.newsId) {
        // Actualizar borrador existente
        this.newsService.updateNews(this.newsId, newsData).subscribe({
          next: (response) => {
            if (response.success) {
              this.success = 'Borrador guardado exitosamente';
            }
          },
          error: (error) => {
            this.error = 'Error al guardar borrador: ' + (error.error?.message || error.message);
          },
        });
      } else {
        // Crear nuevo borrador
        this.newsService.createNews(newsData).subscribe({
          next: (response) => {
            if (response.success) {
              this.success = 'Borrador guardado exitosamente';
              setTimeout(() => {
                this.router.navigate(['/my-news']);
              }, 2000);
            }
          },
          error: (error) => {
            this.error = 'Error al guardar borrador: ' + (error.error?.message || error.message);
          },
        });
      }
    }
  }

  canEditNews(news: any): boolean {
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
}
