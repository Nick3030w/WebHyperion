import { User } from './user.model';
import { News } from './news.model';

export interface Comment {
  _id?: string;
  content: string;
  author: string | User;
  news: string | News;
  parentComment?: string | Comment;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  likes?: string[] | User[];
  dislikes?: string[] | User[];
  moderatedBy?: string | User;
  moderationReason?: 'spam' | 'inappropriate' | 'off_topic' | 'harassment' | 'false_info' | 'other';
  moderationNotes?: string;
  isEdited?: boolean;
  editHistory?: Array<{
    content: string;
    editedAt: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
  // Virtuals para respuestas
  replyCount?: number;
  replies?: Comment[];
}

export interface CommentResponse {
  success: boolean;
  data: Comment | Comment[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
