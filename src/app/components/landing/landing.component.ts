import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <!-- Header -->
      <header class="landing-header">
        <div class="header-content">
          <div class="logo">
            <h1>🌐 HyperNews</h1>
          </div>
          <nav class="nav-links">
            <a routerLink="/login" class="nav-link">Iniciar Sesión</a>
            <a routerLink="/register" class="nav-link primary">Registrarse</a>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Bienvenido a <span class="highlight">HyperNews</span></h1>
            <p class="hero-subtitle">
              La plataforma de noticias confiables donde la comunidad verifica la información.
              Combate la desinformación y mantente informado con contenido verificado.
            </p>
            <div class="hero-actions">
              <a routerLink="/register" class="btn btn-primary btn-large"> Comenzar Ahora </a>
              <a routerLink="/news" class="btn btn-secondary"> Ver Noticias </a>
            </div>
          </div>
          <div class="hero-image">
            <div class="image-placeholder">📰✨</div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">¿Por qué elegir HyperNews?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Verificación de Fuentes</h3>
              <p>
                Todas las noticias pasan por un proceso de verificación para garantizar su
                autenticidad.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Comunidad Activa</h3>
              <p>
                Participa en discusiones constructivas y ayuda a mantener la calidad del contenido.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Contenido Personalizado</h3>
              <p>Recibe noticias relevantes según tus intereses y preferencias.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <h3>Moderación Profesional</h3>
              <p>Contenido moderado por expertos para mantener altos estándares de calidad.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Roles Section -->
      <section class="roles-section">
        <div class="container">
          <h2 class="section-title">Elige tu rol en la comunidad</h2>
          <div class="roles-grid">
            <div class="role-card">
              <div class="role-icon">👀</div>
              <h3>Lector</h3>
              <ul>
                <li>Acceso a todas las noticias verificadas</li>
                <li>Navegación sin límites</li>
                <li>Contenido de calidad garantizada</li>
              </ul>
            </div>
            <div class="role-card">
              <div class="role-icon">💬</div>
              <h3>Usuario Registrado</h3>
              <ul>
                <li>Todos los beneficios del Lector</li>
                <li>Comentarios en noticias</li>
                <li>Interacción con la comunidad</li>
                <li>Sistema de likes/dislikes</li>
              </ul>
            </div>
            <div class="role-card featured">
              <div class="role-icon">✍️</div>
              <h3>Periodista</h3>
              <ul>
                <li>Todos los beneficios anteriores</li>
                <li>Crear y publicar noticias</li>
                <li>Panel de gestión personal</li>
                <li>Estadísticas de tus publicaciones</li>
              </ul>
            </div>
            <div class="role-card">
              <div class="role-icon">⚡</div>
              <h3>Moderador</h3>
              <ul>
                <li>Gestión de contenido</li>
                <li>Panel de moderación</li>
                <li>Aprobar/rechazar publicaciones</li>
                <li>Mantener calidad de la plataforma</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Únete a nuestra comunidad</h2>
            <p>Más de 10,000 usuarios ya confían en HyperNews para mantenerse informados</p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn btn-primary btn-large"> Crear Cuenta Gratis </a>
              <a routerLink="/login" class="btn btn-secondary"> Ya tengo cuenta </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>HyperNews</h3>
              <p>Plataforma de noticias confiables y verificadas por la comunidad.</p>
            </div>
            <div class="footer-section">
              <h4>Enlaces Rápidos</h4>
              <a routerLink="/news">Noticias</a>
              <a routerLink="/login">Iniciar Sesión</a>
              <a routerLink="/register">Registrarse</a>
            </div>
            <div class="footer-section">
              <h4>Legal</h4>
              <a href="#">Términos de Servicio</a>
              <a href="#">Política de Privacidad</a>
              <a href="#">Cookies</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 HyperNews. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing-container {
        min-height: 100vh;
      }
      .landing-header {
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo h1 {
        margin: 0;
        color: #007bff;
        font-size: 1.5rem;
      }
      .nav-links {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .nav-link {
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: #333;
        border-radius: 5px;
        transition: all 0.3s ease;
      }
      .nav-link.primary {
        background: #007bff;
        color: white;
      }
      .nav-link:hover {
        background: #f8f9fa;
      }
      .nav-link.primary:hover {
        background: #0056b3;
      }
      .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8rem 2rem 4rem;
        margin-top: 60px;
      }
      .hero-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
      }
      .hero-title {
        font-size: 3rem;
        margin: 0 0 1rem 0;
        line-height: 1.2;
      }
      .highlight {
        color: #ffd700;
      }
      .hero-subtitle {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        line-height: 1.6;
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .hero-image {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .image-placeholder {
        font-size: 8rem;
        opacity: 0.8;
      }
      .features-section,
      .roles-section,
      .cta-section {
        padding: 4rem 2rem;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .section-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: #333;
      }
      .features-grid,
      .roles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }
      .feature-card,
      .role-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease;
      }
      .role-card.featured {
        border: 2px solid #007bff;
        transform: scale(1.05);
      }
      .feature-card:hover,
      .role-card:hover {
        transform: translateY(-5px);
      }
      .feature-icon,
      .role-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .feature-card h3,
      .role-card h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.25rem;
      }
      .feature-card p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }
      .role-card ul {
        text-align: left;
        padding: 0;
        margin: 0;
      }
      .role-card li {
        margin-bottom: 0.5rem;
        color: #666;
      }
      .cta-section {
        background: #f8f9fa;
        text-align: center;
      }
      .cta-content h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #333;
      }
      .cta-content p {
        font-size: 1.25rem;
        color: #666;
        margin-bottom: 2rem;
      }
      .cta-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-block;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-primary:hover {
        background: #0056b3;
      }
      .btn-secondary {
        background: transparent;
        color: #007bff;
        border: 2px solid #007bff;
      }
      .btn-secondary:hover {
        background: #007bff;
        color: white;
      }
      .btn-large {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }
      .landing-footer {
        background: #333;
        color: white;
        padding: 3rem 2rem 1rem;
      }
      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .footer-section h3,
      .footer-section h4 {
        margin: 0 0 1rem 0;
      }
      .footer-section a {
        display: block;
        color: #ccc;
        text-decoration: none;
        margin-bottom: 0.5rem;
      }
      .footer-section a:hover {
        color: white;
      }
      .footer-bottom {
        border-top: 1px solid #555;
        padding-top: 1rem;
        text-align: center;
        color: #ccc;
      }
      @media (max-width: 768px) {
        .hero-content {
          grid-template-columns: 1fr;
          text-align: center;
        }
        .hero-title {
          font-size: 2rem;
        }
        .role-card.featured {
          transform: none;
        }
      }
    `,
  ],
})
export class LandingComponent {
  authService = inject(AuthService);
}
