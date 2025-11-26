import { User } from './user.model';

export interface News {
  _id?: string;
  title: string;
  content: string;
  summary?: string;
  author: string | User;
  category: string;
  sources?: Array<{
    name: string;
    url: string;
  }>;
  images?: Array<{
    url: string;
    caption: string;
  }>;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';
  isBreakingNews?: boolean;
  tags?: string[];
  viewCount?: number;
  commentCount?: number; // ← AGREGAR ESTA PROPIEDAD
  reviewedBy?: string | User;
  reviewComments?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsResponse {
  success: boolean;
  data: News | News[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
