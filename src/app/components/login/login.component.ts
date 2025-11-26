import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión en HyperNews</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tu@email.com"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <div
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
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
                loginForm.get('password')?.invalid && loginForm.get('password')?.touched
              "
            />
            <div
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              class="error-message"
            >
              Contraseña es requerida (mínimo 6 caracteres)
            </div>
          </div>

          <button type="submit" class="login-btn" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div *ngIf="error" class="error-message server-error">
            {{ error }}
          </div>
        </form>

        <div class="login-links">
          <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
          <p><a routerLink="/forgot-password">¿Olvidaste tu contraseña?</a></p>
        </div>

        <div class="roles-info">
          <h4>Tipos de Usuarios:</h4>
          <ul>
            <li><strong>Lector:</strong> Solo lectura de noticias</li>
            <li><strong>Usuario Registrado:</strong> Lectura + Comentarios</li>
            <li><strong>Periodista:</strong> Crear y editar noticias</li>
            <li><strong>Moderador:</strong> Gestionar contenido</li>
            <li><strong>Admin:</strong> Acceso completo</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
      }
      .login-card {
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
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
      }
      input.error {
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
      .login-btn {
        width: 100%;
        padding: 0.75rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
      }
      .login-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }
      .login-links {
        margin-top: 1rem;
        text-align: center;
      }
      .login-links a {
        color: #007bff;
        text-decoration: none;
      }
      .roles-info {
        margin-top: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 5px;
      }
      .roles-info h4 {
        margin-top: 0;
      }
      .roles-info ul {
        margin: 0;
        padding-left: 1rem;
      }
      .roles-info li {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Redirigir según el rol del usuario
            const defaultRoute = this.authService.getDefaultRoute();
            this.router.navigate([defaultRoute]);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error =
            error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        },
      });
    }
  }
}
