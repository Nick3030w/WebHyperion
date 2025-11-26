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
      <!-- Hero Section Mejorada -->
      <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="hero-text">
            <div class="badge">✨ Plataforma Confiable</div>
            <h1 class="hero-title">
              Información <span class="highlight">Verificada</span>, Comunidad
              <span class="highlight">Activa</span>
            </h1>
            <p class="hero-subtitle">
              En HyperNews combatimos la desinformación con noticias verificadas por periodistas
              profesionales y una comunidad comprometida con la verdad.
            </p>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">+10K</span>
                <span class="stat-label">Usuarios</span>
              </div>
              <div class="stat">
                <span class="stat-number">+5K</span>
                <span class="stat-label">Noticias</span>
              </div>
              <div class="stat">
                <span class="stat-number">+20K</span>
                <span class="stat-label">Comentarios</span>
              </div>
            </div>
            <div class="hero-actions">
              <a routerLink="/register" class="btn btn-primary btn-large"> 🚀 Comenzar Gratis </a>
              <a routerLink="/news" class="btn btn-secondary"> 📰 Ver Noticias </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="floating-card card-1">
              <div class="card-icon">📰</div>
              <h4>Noticias Verificadas</h4>
              <p>Contenido 100% confiable</p>
            </div>
            <div class="floating-card card-2">
              <div class="card-icon">👥</div>
              <h4>Comunidad Activa</h4>
              <p>Discusiones constructivas</p>
            </div>
            <div class="floating-card card-3">
              <div class="card-icon">🛡️</div>
              <h4>Moderación Profesional</h4>
              <p>Calidad garantizada</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section Mejorada -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <h2>Combate la desinformación con herramientas poderosas</h2>
            <p>
              HyperNews te ofrece todo lo que necesitas para mantenerte informado de manera
              confiable
            </p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Verificación en Tiempo Real</h3>
              <p>
                Sistema de verificación multicapa que asegura la autenticidad de cada noticia antes
                de su publicación.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Análisis de Fuentes</h3>
              <p>
                Evaluación continua de la credibilidad de las fuentes con puntuaciones
                transparentes.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🤝</div>
              <h3>Comunidad Verificadora</h3>
              <p>
                Usuarios certificados ayudan a validar información y reportar contenido sospechoso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <h2>¿Listo para unirte a la revolución de las noticias confiables?</h2>
            <p>
              Regístrate hoy y forma parte de una comunidad que valora la verdad y la transparencia.
            </p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn btn-primary btn-large"> Crear Mi Cuenta </a>
              <div class="benefits">
                <span>✅ Sin costos ocultos</span>
                <span>✅ Fácil de usar</span>
                <span>✅ Comienza en 2 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .landing-container {
        min-height: 100vh;
      }

      /* Hero Section Mejorada */
      .hero-section {
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 6rem 2rem;
        overflow: hidden;
      }

      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
      }

      .hero-content {
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
      }

      .badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
        backdrop-filter: blur(10px);
      }

      .hero-title {
        font-size: 3.5rem;
        margin: 0 0 1.5rem 0;
        line-height: 1.1;
        font-weight: 700;
      }

      .highlight {
        background: linear-gradient(45deg, #ffd700, #ff6b6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .hero-stats {
        display: flex;
        gap: 2rem;
        margin-bottom: 2.5rem;
      }

      .stat {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: bold;
      }

      .stat-label {
        font-size: 0.875rem;
        opacity: 0.8;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .hero-visual {
        position: relative;
        height: 400px;
      }

      .floating-card {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .card-1 {
        top: 20%;
        left: 10%;
        animation: float 3s ease-in-out infinite;
      }

      .card-2 {
        top: 50%;
        right: 10%;
        animation: float 3s ease-in-out infinite 1s;
      }

      .card-3 {
        bottom: 20%;
        left: 30%;
        animation: float 3s ease-in-out infinite 2s;
      }

      .card-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .floating-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }

      .floating-card p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      /* Features Section Mejorada */
      .features-section {
        padding: 6rem 2rem;
        background: #f8f9fa;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #333;
      }

      .section-header p {
        font-size: 1.25rem;
        color: #666;
        max-width: 600px;
        margin: 0 auto;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .feature-card {
        background: white;
        padding: 2.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
      }

      .feature-card h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.5rem;
      }

      .feature-card p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }

      /* CTA Section */
      .cta-section {
        padding: 6rem 2rem;
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        color: white;
      }

      .cta-card {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }

      .cta-card h2 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
      }

      .cta-card p {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
      }

      .cta-actions {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
      }

      .benefits {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .benefits span {
        font-size: 0.875rem;
        opacity: 0.8;
      }

      /* Botones */
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-block;
        text-align: center;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }

      .btn-secondary:hover {
        background: white;
        color: #007bff;
      }

      .btn-large {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-content {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
        }

        .hero-stats {
          justify-content: center;
        }

        .hero-visual {
          height: 300px;
        }

        .floating-card {
          position: relative;
          margin-bottom: 1rem;
        }

        .card-1,
        .card-2,
        .card-3 {
          position: relative;
          top: auto;
          left: auto;
          right: auto;
          bottom: auto;
          margin: 0 auto 1rem auto;
          max-width: 250px;
        }
      }
    `,
  ],
})
export class LandingComponent {
  authService = inject(AuthService);
}
