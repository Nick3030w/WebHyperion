import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
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
              Título es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="summary">Resumen</label>
            <textarea
              id="summary"
              formControlName="summary"
              placeholder="Breve resumen de la noticia..."
              rows="3"
            ></textarea>
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
              Contenido es requerido
            </div>
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
            <label for="isBreakingNews">Noticia de última hora</label>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              (click)="onSaveDraft()"
              [disabled]="newsForm.invalid"
            >
              Guardar Borrador
            </button>
            <button type="submit" class="btn-primary" [disabled]="newsForm.invalid || loading">
              {{ loading ? 'Enviando...' : 'Enviar para Revisión' }}
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
    `,
  ],
})
export class NewsFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  newsForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  isEdit = false;

  constructor() {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required]],
      summary: [''],
      content: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: [''],
      isBreakingNews: [false],
    });
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      this.loading = true;
      this.error = '';

      // Simular envío
      setTimeout(() => {
        this.loading = false;
        this.success = 'Noticia enviada para revisión exitosamente';
        setTimeout(() => {
          this.router.navigate(['/my-news']);
        }, 2000);
      }, 1000);
    }
  }

  onSaveDraft(): void {
    if (this.newsForm.valid) {
      this.success = 'Borrador guardado exitosamente';
    }
  }
}
