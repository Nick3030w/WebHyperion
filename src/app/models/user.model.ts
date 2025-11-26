export interface User {
  _id?: string;
  id?: string; // ← AGREGAR esta propiedad
  name: string;
  email: string;
  password?: string;
  role: 'reader' | 'registered_user' | 'journalist' | 'moderator' | 'admin';
  isActive?: boolean;
  profile?: {
    bio?: string;
    avatar?: string;
    specialization?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string; // El backend devuelve 'id'
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

// Interface para la respuesta del perfil
export interface ProfileResponse {
  success: boolean;
  data: User;
}
