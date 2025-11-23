import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <!-- Loader global opcional -->
    <div class="global-loader" *ngIf="isLoading">
      <div class="loader-content">
        <i class="fas fa-newspaper loader-icon"></i>
        <p>Cargando Hyperion News...</p>
      </div>
    </div>
    
    <router-outlet></router-outlet>
  `,
    styles: [`
    .global-loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
    }

    .loader-content {
      text-align: center;
    }

    .loader-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class AppComponent {
    isLoading = false; // Puedes controlar esto con un servicio de loading
}