import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ← AGREGAR ESTE IMPORT

@Component({
    selector: 'app-news-list',
    standalone: true,
    imports: [CommonModule, FormsModule], // ← AGREGAR FormsModule AQUÍ
    template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12">
          <h1>Últimas Noticias</h1>
          <p class="lead">Mantente informado con las noticias más recientes</p>
        </div>
      </div>

      <!-- Barra de búsqueda CORREGIDA -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Buscar noticias..." 
                   [(ngModel)]="searchTerm" (input)="filterNews()" #searchInput>
            <button class="btn btn-outline-secondary" type="button" (click)="filterNews()">
              Buscar
            </button>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-primary" (click)="loadNews()">
            Actualizar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando noticias...</p>
      </div>

      <!-- Lista de noticias -->
      <div *ngIf="!loading" class="row">
        <div *ngFor="let noticia of filteredNews" class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 news-card" (click)="viewNews(noticia)">
            <img [src]="noticia.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'" 
                 class="card-img-top" [alt]="noticia.titulo" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{noticia.titulo}}</h5>
              <p class="card-text flex-grow-1">{{(noticia.descripcion || '').slice(0,100)}}...</p>
              <div class="mt-auto">
                <small class="text-muted">
                  {{noticia.autor}} | {{noticia.fecha | date:'dd/MM/yyyy'}}
                </small>
                <div class="mt-2">
                  <span class="badge bg-primary">{{noticia.categoria}}</span>
                  <button class="btn btn-sm btn-outline-primary float-end" (click)="viewNews(noticia); $event.stopPropagation()">
                    Leer más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div *ngIf="!loading && filteredNews.length === 0" class="text-center py-5">
        <h3>No se encontraron noticias</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>
    </div>
  `,
    styles: [`
    .news-card {
      transition: transform 0.2s;
      cursor: pointer;
    }
    .news-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class NewsListComponent implements OnInit {
    noticias: any[] = [];
    filteredNews: any[] = [];
    loading: boolean = false;
    searchTerm: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadNews();
    }

    loadNews() {
        this.loading = true;
        // Intentar cargar del backend
        this.http.get('http://localhost:9000/api/noticias').subscribe({
            next: (response: any) => {
                this.noticias = response;
                this.filteredNews = response;
                this.loading = false;
                console.log('Noticias cargadas del backend:', response);
            },
            error: (error) => {
                console.error('Error cargando noticias:', error);
                // Usar datos de ejemplo
                this.noticias = this.getSampleNews();
                this.filteredNews = this.noticias;
                this.loading = false;
            }
        });
    }

    filterNews() {
        if (!this.searchTerm) {
            this.filteredNews = this.noticias;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredNews = this.noticias.filter(noticia =>
                noticia.titulo.toLowerCase().includes(term) ||
                (noticia.descripcion && noticia.descripcion.toLowerCase().includes(term)) ||
                noticia.categoria.toLowerCase().includes(term)
            );
        }
    }

    viewNews(noticia: any) {
        alert(`📰 ${noticia.titulo}\n\n📖 ${noticia.contenido || noticia.descripcion}\n\n👤 Autor: ${noticia.autor}\n📅 Fecha: ${noticia.fecha}\n🏷️ Categoría: ${noticia.categoria}`);
    }

    // Noticias de ejemplo
    private getSampleNews() {
        return [
            {
                id: 1,
                titulo: "Avances en Tecnología para el 2024",
                descripcion: "Los últimos desarrollos tecnológicos que cambiarán nuestra forma de vivir y trabajar en el próximo año.",
                contenido: "La inteligencia artificial continúa revolucionando diversos sectores. Empresas como OpenAI y Google están desarrollando modelos más avanzados que prometen transformar la educación, la medicina y el trabajo remoto. Además, la realidad virtual y aumentada están ganando terreno en el entretenimiento y la formación profesional.",
                imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
                autor: "Carlos Rodríguez",
                fecha: new Date('2024-01-15'),
                categoria: "Tecnología"
            },
            {
                id: 2,
                titulo: "Nuevo Descubrimiento Científico Revolucionario",
                descripcion: "Investigadores internacionales hacen un descubrimiento que podría cambiar el tratamiento de enfermedades crónicas.",
                contenido: "Un equipo de científicos ha descubierto una nueva proteína que regula el envejecimiento celular. Este hallazgo podría conducir a tratamientos innovadores para enfermedades como el Alzheimer y el Parkinson. Los estudios preliminares en ratones han mostrado resultados prometedores, aumentando la esperanza de vida en un 30%.",
                imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
                autor: "María González",
                fecha: new Date('2024-01-14'),
                categoria: "Ciencia"
            },
            {
                id: 3,
                titulo: "Tendencias en Deportes para 2024",
                descripcion: "Lo que viene en el mundo deportivo: nuevos torneos, tecnologías y atletas a seguir este año.",
                contenido: "El 2024 promete ser un año emocionante para los deportes. Con los Juegos Olímpicos de París en el horizonte, nuevas tecnologías como el VAR mejorado y el uso de analytics están transformando cómo seguimos y practicamos deportes. Atletas emergentes en deportes como el surf, la escalada y el breakdance están ganando popularidad.",
                imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=200&fit=crop",
                autor: "Juan Pérez",
                fecha: new Date('2024-01-13'),
                categoria: "Deportes"
            },
            {
                id: 4,
                titulo: "Innovaciones en Energías Renovables",
                descripcion: "Nuevas tecnologías en energía solar y eólica que prometen hacerlas más accesibles.",
                contenido: "Las energías renovables están experimentando una revolución. Paneles solares con un 40% más de eficiencia y turbinas eólicas flotantes están haciendo que la energía limpia sea más viable económicamente. Países como España y Alemania están liderando la transición energética en Europa.",
                imagen: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop",
                autor: "Ana López",
                fecha: new Date('2024-01-12'),
                categoria: "Medio Ambiente"
            },
            {
                id: 5,
                titulo: "El Futuro del Trabajo Remoto",
                descripcion: "Cómo las empresas están adaptando sus políticas de trabajo híbrido post-pandemia.",
                contenido: "El trabajo remoto ha venido para quedarse. Empresas tecnológicas están implementando modelos híbridos que combinan lo mejor de la oficina y el trabajo desde casa. Nuevas herramientas de colaboración y políticas de bienestar digital están emergiendo para apoyar a los equipos distribuidos.",
                imagen: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=200&fit=crop",
                autor: "Roberto Sánchez",
                fecha: new Date('2024-01-11'),
                categoria: "Negocios"
            },
            {
                id: 6,
                titulo: "Cultura y Entretenimiento Digital",
                descripcion: "Las plataformas de streaming y contenido digital que dominarán el entretenimiento este año.",
                contenido: "El entretenimiento digital continúa evolucionando rápidamente. Plataformas como Netflix, Disney+ y nuevas alternativas están compitiendo por la atención global. Contenido interactivo, realidad virtual en el cine y series basadas en inteligencia artificial son algunas de las tendencias que veremos este año.",
                imagen: "https://images.unsplash.com/photo-1489599809505-7c8e1a43ccde?w=300&h=200&fit=crop",
                autor: "Laura Martínez",
                fecha: new Date('2024-01-10'),
                categoria: "Entretenimiento"
            }
        ];
    }
}