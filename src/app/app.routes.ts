import { Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login';
import { SignupComponent } from './components/authentication/signup/signup';
import { HomeiComponent } from './components/homei/homei';
import { NewsListComponent } from './components/news/news-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { path: 'home', component: HomeiComponent },
    { path: 'noticias', component: NewsListComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];