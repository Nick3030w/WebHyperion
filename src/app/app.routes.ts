import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },

  // Rutas públicas
  {
    path: 'news',
    loadComponent: () =>
      import('./components/news-list/news-list.component').then((m) => m.NewsListComponent),
  },
  {
    path: 'news/:id',
    loadComponent: () =>
      import('./components/news-detail/news-detail.component').then((m) => m.NewsDetailComponent),
  },

  // Rutas para usuarios registrados (pueden comentar)
  {
    path: 'comments',
    loadComponent: () =>
      import('./components/my-comments/my-comments.component').then((m) => m.MyCommentsComponent),
    canActivate: [roleGuard],
    data: { roles: ['registered_user', 'journalist', 'moderator', 'admin'] },
  },

  // Rutas para periodistas (pueden crear noticias)
  {
    path: 'create-news',
    loadComponent: () =>
      import('./components/news-form/news-form.component').then((m) => m.NewsFormComponent),
    canActivate: [roleGuard],
    data: { roles: ['journalist', 'moderator', 'admin'] },
  },
  {
    path: 'my-news',
    loadComponent: () =>
      import('./components/my-news/my-news.component').then((m) => m.MyNewsComponent),
    canActivate: [roleGuard],
    data: { roles: ['journalist', 'moderator', 'admin'] },
  },

  // Rutas para moderadores
  {
    path: 'moderation',
    loadComponent: () =>
      import('./components/moderation/moderation.component').then((m) => m.ModerationComponent),
    canActivate: [roleGuard],
    data: { roles: ['moderator', 'admin'] },
  },

  // Rutas para administradores
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [roleGuard],
    data: { roles: ['moderator', 'admin'] },
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },

  // Ruta para no autorizado
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // Ruta de fallback
  { path: '**', redirectTo: '/news' },
];
