import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { News, NewsResponse } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/news`;

  // Obtener todas las noticias
  getAllNews(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Observable<NewsResponse> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (category && category !== 'todas') url += `&category=${category}`;
    if (search) url += `&search=${search}`;

    return this.http.get<NewsResponse>(url);
  }

  // Obtener noticia por ID
  getNewsById(id: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva noticia
  createNews(newsData: Partial<News>): Observable<NewsResponse> {
    return this.http.post<NewsResponse>(this.apiUrl, newsData);
  }

  // Actualizar noticia
  updateNews(id: string, newsData: Partial<News>): Observable<NewsResponse> {
    return this.http.put<NewsResponse>(`${this.apiUrl}/${id}`, newsData);
  }

  // Eliminar noticia
  deleteNews(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Obtener noticias del usuario actual
  getMyNews(page: number = 1, limit: number = 10): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/my/news?page=${page}&limit=${limit}`);
  }

  // Obtener noticias para moderación
  getNewsForModeration(
    status: string = 'pending_review',
    page: number = 1,
    limit: number = 10
  ): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(
      `${this.apiUrl}/moderation/queue?status=${status}&page=${page}&limit=${limit}`
    );
  }

  // Aprobar/Rechazar noticia
  reviewNews(id: string, status: string, reviewComments?: string): Observable<NewsResponse> {
    return this.http.patch<NewsResponse>(`${this.apiUrl}/${id}/review`, {
      status,
      reviewComments,
    });
  }
}
