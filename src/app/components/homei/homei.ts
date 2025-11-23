import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-homei',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <!-- Background -->
  <div class="dashboard-background">
    <div class="background-pattern"></div>
  </div>

  <!-- Main Container -->
  <div class="dashboard-container">
    
    <!-- Header -->
    <header class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="brand-section">
            <i class="fas fa-newspaper brand-logo"></i>
            <span class="brand-text">Hyperion News</span>
          </div>
          
          <div class="user-section">
            <div class="user-info">
              <div class="user-avatar">
                {{usuario?.avatar || '👤'}}
              </div>
              <div class="user-details">
                <span class="user-name">{{usuario?.nombre || 'Usuario'}}</span>
                <span class="user-email">{{usuario?.email || 'usuario@email.com'}}</span>
              </div>
            </div>
            <button class="logout-btn" (click)="logout()" title="Cerrar Sesión">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="container">
        
        <!-- Welcome Section -->
        <section class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">
              ¡Bienvenido de vuelta, <span class="highlight">{{usuario?.nombre || 'Usuario'}}</span>!
            </h1>
            <p class="welcome-subtitle">
              Te damos la bienvenida a tu portal de noticias personalizado. Mantente informado con lo último.
            </p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card">
              <i class="fas fa-newspaper stat-icon"></i>
              <div class="stat-info">
                <span class="stat-number">24</span>
                <span class="stat-label">Nuevas Noticias</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="actions-section">
          <h2 class="section-title">Acciones Rápidas</h2>
          <div class="actions-grid">
            
            <!-- News Card -->
            <div class="action-card news-card">
              <div class="card-icon">
                <i class="fas fa-newspaper"></i>
              </div>
              <div class="card-content">
                <h3>Explorar Noticias</h3>
                <p>Descubre las últimas noticias y tendencias en tiempo real</p>
              </div>
              <button class="card-action-btn" routerLink="/noticias">
                Ver Noticias
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>

            <!-- Profile Card -->
            <div class="action-card profile-card">
              <div class="card-icon">
                <i class="fas fa-user-cog"></i>
              </div>
              <div class="card-content">
                <h3>Mi Perfil</h3>
                <p>Gestiona tu información personal y preferencias</p>
              </div>
              <button class="card-action-btn disabled" disabled>
                Próximamente
                <i class="fas fa-clock"></i>
              </button>
            </div>

            <!-- Settings Card -->
            <div class="action-card settings-card">
              <div class="card-icon">
                <i class="fas fa-cog"></i>
              </div>
              <div class="card-content">
                <h3>Configuración</h3>
                <p>Personaliza tu experiencia y ajustes de la cuenta</p>
              </div>
              <button class="card-action-btn disabled" disabled>
                Próximamente
                <i class="fas fa-clock"></i>
              </button>
            </div>

            <!-- Bookmarks Card -->
            <div class="action-card bookmarks-card">
              <div class="card-icon">
                <i class="fas fa-bookmark"></i>
              </div>
              <div class="card-content">
                <h3>Guardados</h3>
                <p>Accede a tus noticias y artículos guardados</p>
              </div>
              <button class="card-action-btn disabled" disabled>
                Próximamente
                <i class="fas fa-clock"></i>
              </button>
            </div>

          </div>
        </section>

        <!-- Recent Activity -->
        <section class="activity-section">
          <div class="section-header">
            <h2 class="section-title">Actividad Reciente</h2>
            <span class="section-badge">3 actividades</span>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon success">
                <i class="fas fa-check"></i>
              </div>
              <div class="activity-content">
                <p>Sesión iniciada correctamente</p>
                <span class="activity-time">Hace unos momentos</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon info">
                <i class="fas fa-bell"></i>
              </div>
              <div class="activity-content">
                <p>24 nuevas noticias disponibles</p>
                <span class="activity-time">Hace 2 horas</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon warning">
                <i class="fas fa-exclamation"></i>
              </div>
              <div class="activity-content">
                <p>Completa tu perfil para una mejor experiencia</p>
                <span class="activity-time">Ayer</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <div class="container">
        <p>&copy; 2024 Hyperion News. Todos los derechos reservados.</p>
      </div>
    </footer>

  </div>
  `,
  styles: [`
    .dashboard-background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -2;
    }

    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
    }

    .dashboard-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .dashboard-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo {
      font-size: 2rem;
      color: #667eea;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.8rem;
      color: #718096;
    }

    .logout-btn {
      background: none;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.5rem;
      color: #718096;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: #fed7d7;
      color: #c53030;
      border-color: #fed7d7;
    }

    /* Main Content */
    .dashboard-main {
      flex: 1;
      padding: 2rem 0;
    }

    /* Welcome Section */
    .welcome-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .highlight {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 1.1rem;
      color: #718096;
      max-width: 500px;
    }

    .welcome-stats {
      display: flex;
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(102, 126, 234, 0.1);
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .stat-icon {
      font-size: 2rem;
      color: #667eea;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #718096;
    }

    /* Actions Section */
    .actions-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .news-card .card-icon { color: #667eea; }
    .profile-card .card-icon { color: #48bb78; }
    .settings-card .card-icon { color: #ed8936; }
    .bookmarks-card .card-icon { color: #9f7aea; }

    .card-content {
      flex: 1;
      margin-bottom: 1.5rem;
    }

    .card-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .card-content p {
      color: #718096;
      line-height: 1.5;
    }

    .card-action-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .card-action-btn:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .card-action-btn.disabled {
      background: #e2e8f0;
      color: #a0aec0;
      cursor: not-allowed;
    }

    /* Activity Section */
    .activity-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(247, 250, 252, 0.8);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .activity-item:hover {
      background: rgba(247, 250, 252, 1);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .activity-icon.success { background: #c6f6d5; color: #38a169; }
    .activity-icon.info { background: #bee3f8; color: #3182ce; }
    .activity-icon.warning { background: #fed7d7; color: #e53e3e; }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      margin: 0;
      font-weight: 500;
      color: #2d3748;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #718096;
    }

    /* Footer */
    .dashboard-footer {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1.5rem 0;
      text-align: center;
      color: #718096;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .welcome-title {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeiComponent implements OnInit {
  usuario: any = { nombre: 'Usuario Demo' };

  constructor(private router: Router) { }

  ngOnInit() {
    this.verificarAutenticacion();
    this.cargarUsuario();
  }

  verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  cargarUsuario() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.usuario = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}