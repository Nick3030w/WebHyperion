import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <h1>⛔ Acceso No Autorizado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>Tu rol actual no tiene los privilegios necesarios.</p>
        <button routerLink="/news" class="btn-primary">Volver al Inicio</button>
      </div>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 20px;
      }
      .unauthorized-card {
        text-align: center;
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
      }
      .btn-primary {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
    `,
  ],
})
export class UnauthorizedComponent {}
