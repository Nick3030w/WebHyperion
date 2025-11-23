import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h3>📝 Registrarse - Hyperion News</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="register()">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nombre"
                  [(ngModel)]="userData.nombre"
                  name="nombre"
                  required
                  placeholder="Tu nombre">
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  [(ngModel)]="userData.email"
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
                  [(ngModel)]="userData.password"
                  name="password"
                  required
                  placeholder="Crea una contraseña segura">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg">
                  <i class="fas fa-user-plus"></i> Registrarse
                </button>
              </div>
            </form>

            <div class="mt-3 text-center">
              <p>¿Ya tienes cuenta? 
                <a routerLink="/login" class="text-decoration-none">Inicia sesión aquí</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class SignupComponent {
  userData = {
    nombre: '',
    email: '',
    password: ''
  };

  constructor(private router: Router) { }

  register() {
    console.log('Registrando usuario:', this.userData);

    if (this.userData.nombre && this.userData.email && this.userData.password) {
      // Simulación de registro exitoso
      localStorage.setItem('token', 'token-' + Date.now());
      localStorage.setItem('user', JSON.stringify({
        nombre: this.userData.nombre,
        email: this.userData.email
      }));

      this.router.navigate(['/home']);
    } else {
      alert('Por favor completa todos los campos');
    }
  }
}