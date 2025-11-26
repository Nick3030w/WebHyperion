import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Registrarse en HyperNews</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Tu nombre completo"
              [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            />
            <div
              *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              class="error-message"
            >
              Nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tu@email.com"
              [class.error]="
                registerForm.get('email')?.invalid && registerForm.get('email')?.touched
              "
            />
            <div
              *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              class="error-message"
            >
              Email es requerido y debe ser válido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.error]="
                registerForm.get('password')?.invalid && registerForm.get('password')?.touched
              "
            />
            <div
              *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              class="error-message"
            >
              Contraseña es requerida (mínimo 6 caracteres)
            </div>
          </div>

          <div class="form-group">
            <label for="role">Tipo de cuenta</label>
            <select id="role" formControlName="role" class="form-select">
              <option value="reader">Lector (Solo lectura)</option>
              <option value="registered_user">Usuario Registrado (Puede comentar)</option>
              <option value="journalist">Periodista (Puede crear noticias)</option>
            </select>
            <small class="form-text"
              >Los roles de Moderador y Admin son asignados por administradores</small
            >
          </div>

          <button type="submit" class="register-btn" [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>

          <div *ngIf="error" class="error-message server-error">
            {{ error }}
          </div>

          <div *ngIf="success" class="success-message">
            {{ success }} <a routerLink="/login">Iniciar sesión</a>
          </div>
        </form>

        <div class="register-links">
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
      }
      .register-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      input,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
      }
      input.error,
      select.error {
        border-color: #e74c3c;
      }
      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .success-message {
        color: #27ae60;
        background: #e8f6ef;
        padding: 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
      }
      .server-error {
        background: #ffeaea;
        padding: 0.75rem;
        border-radius: 5px;
        margin-top: 1rem;
      }
      .register-btn {
        width: 100%;
        padding: 0.75rem;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
      }
      .register-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }
      .register-links {
        margin-top: 1rem;
        text-align: center;
      }
      .register-links a {
        color: #007bff;
        text-decoration: none;
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['reader', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const userData: RegisterRequest = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.success = '¡Registro exitoso! ';
            this.registerForm.reset({ role: 'reader' });
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Error en el registro. Intenta nuevamente.';
        },
      });
    }
  }
}
