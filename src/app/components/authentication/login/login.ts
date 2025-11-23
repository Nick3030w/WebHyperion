import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <div class="login-container">
    <div class="background-gradient"></div>
    
    <div class="container-fluid vh-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="login-card">
            <!-- Header -->
            <div class="login-header text-center mb-4">
              <div class="logo-container">
                <i class="fas fa-newspaper logo-icon"></i>
                <h1 class="logo-text">Hyperion News</h1>
              </div>
              <p class="text-muted">Ingresa a tu cuenta</p>
            </div>

            <!-- Form -->
            <form (ngSubmit)="login()" class="login-form">
              <div class="form-group mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    [(ngModel)]="credentials.email"
                    name="email"
                    required
                    placeholder="usuario@ejemplo.com">
                </div>
              </div>
              
              <div class="form-group mb-4">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    [(ngModel)]="credentials.password"
                    name="password"
                    required
                    placeholder="••••••••">
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 login-btn">
                <i class="fas fa-sign-in-alt me-2"></i>
                Iniciar Sesión
              </button>
            </form>

            <!-- Divider -->
            <div class="divider my-4">
              <span class="divider-text">o</span>
            </div>

            <!-- Demo Button -->
            <button class="btn btn-outline-primary w-100 demo-btn" (click)="loginDemo()">
              <i class="fas fa-rocket me-2"></i>
              Acceso Demo
            </button>

            <!-- Register Link -->
            <div class="text-center mt-4">
              <p class="register-text">
                ¿No tienes cuenta? 
                <a routerLink="/register" class="register-link">Crear cuenta</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .login-container {
      position: relative;
      min-height: 100vh;
    }

    .background-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -1;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }

    .logo-container {
      margin-bottom: 1rem;
    }

    .logo-icon {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .logo-text {
      font-weight: 700;
      color: #2d3748;
      margin: 0;
      font-size: 1.8rem;
    }

    .login-header p {
      color: #718096;
      font-size: 0.9rem;
    }

    .form-group label {
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 0.5rem;
    }

    .input-group-text {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-right: none;
    }

    .form-control {
      border: 1px solid #e2e8f0;
      border-left: none;
      padding: 0.75rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      border-color: #667eea;
    }

    .login-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 0.75rem;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .divider {
      position: relative;
      text-align: center;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .divider-text {
      background: white;
      padding: 0 1rem;
      color: #718096;
      font-size: 0.9rem;
    }

    .demo-btn {
      border-radius: 10px;
      padding: 0.75rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .demo-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
    }

    .register-text {
      color: #718096;
      margin: 0;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .register-link:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private router: Router) { }

  login() {
    console.log('Intentando login:', this.credentials);

    if (this.credentials.email && this.credentials.password) {
      this.loginSuccess();
    } else {
      alert('Por favor completa todos los campos');
    }
  }

  loginDemo() {
    const demoUser = {
      nombre: 'Alex Johnson',
      email: 'alex.johnson@hyperion.com',
      avatar: '👨‍💼'
    };

    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(demoUser));

    this.router.navigate(['/home']);
  }

  private loginSuccess() {
    const user = {
      nombre: this.credentials.email.split('@')[0],
      email: this.credentials.email,
      avatar: '👤'
    };

    localStorage.setItem('token', 'token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));

    this.router.navigate(['/home']);
  }
}