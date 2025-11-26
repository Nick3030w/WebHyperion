import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Agregar token a las peticiones que requieren autenticación
  const token = getTokenFromStorage();

  if (token && requiresAuth(req.url)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};

// Función auxiliar para obtener el token
function getTokenFromStorage(): string | null {
  return localStorage.getItem('token');
}

function requiresAuth(url: string): boolean {
  // URLs que NO requieren autenticación
  const publicUrls = [
    '/api/users/login',
    '/api/users/register',
    '/api/news',
    '/api/comments/news/',
  ];

  return !publicUrls.some((publicUrl) => url.includes(publicUrl));
}
