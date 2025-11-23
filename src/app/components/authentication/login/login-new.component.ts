import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h3>🔐 Iniciar Sesión - Hyperion News</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="login()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  [(ngModel)]="credentials.email"
                  name="email"
                  required
                  placeholder="usuario@ejemplo.com">
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  [(ngModel)]="credentials.password"
                  name="password"
                  required
                  placeholder="Tu contraseña">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                </button>
              </div>
            </form>

            <div class="mt-3 text-center">
              <p>¿No tienes cuenta? 
                <a routerLink="/register" class="text-decoration-none">Regístrate aquí</a>
              </p>
            </div>

            <!-- Botón de prueba para desarrollo -->
            <div class="mt-3">
              <button class="btn btn-outline-secondary w-100" (click)="loginDemo()">
                🚀 Entrar como Demo (Desarrollo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
    credentials = {
        email: '',
        password: ''
    };

    constructor(private router: Router) { }

    login() {
        console.log('Intentando login:', this.credentials);

        // Simulación de login exitoso
        if (this.credentials.email && this.credentials.password) {
            this.loginSuccess();
        } else {
            alert('Por favor completa todos los campos');
        }
    }

    loginDemo() {
        // Login de demostración para desarrollo
        const demoUser = {
            nombre: 'Usuario Demo',
            email: 'demo@hyperion.com'
        };

        localStorage.setItem('token', 'demo-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(demoUser));

        this.router.navigate(['/home']);
    }

    private loginSuccess() {
        const user = {
            nombre: this.credentials.email.split('@')[0], // Usa la parte del email como nombre
            email: this.credentials.email
        };

        localStorage.setItem('token', 'token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/home']);
    }
}