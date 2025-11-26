import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment, CommentResponse } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comments`;

  // Obtener comentarios de una noticia
  getNewsComments(
    newsId: string,
    page: number = 1,
    limit: number = 20
  ): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(
      `${this.apiUrl}/news/${newsId}?page=${page}&limit=${limit}`
    );
  }

  // Crear comentario
  createComment(commentData: {
    content: string;
    newsId: string;
    parentCommentId?: string;
  }): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(this.apiUrl, commentData);
  }

  // Actualizar comentario
  updateComment(id: string, content: string): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}/${id}`, { content });
  }

  // Eliminar comentario
  deleteComment(id: string, reason?: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
      body: reason ? { reason } : {},
    });
  }

  // Like/Dislike comentario
  reactToComment(id: string, reaction: 'like' | 'dislike'): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/react`, { reaction });
  }

  // Obtener comentarios del usuario actual
  getMyComments(page: number = 1, limit: number = 10): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}/my/comments?page=${page}&limit=${limit}`);
  }

  // Obtener comentarios para moderación
  getCommentsForModeration(
    status: string = 'pending',
    page: number = 1,
    limit: number = 20
  ): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(
      `${this.apiUrl}/moderation/queue?status=${status}&page=${page}&limit=${limit}`
    );
  }

  // Moderar comentario
  moderateComment(
    id: string,
    status: string,
    moderationReason?: string,
    moderationNotes?: string
  ): Observable<CommentResponse> {
    return this.http.patch<CommentResponse>(`${this.apiUrl}/${id}/moderate`, {
      status,
      moderationReason,
      moderationNotes,
    });
  }
}
