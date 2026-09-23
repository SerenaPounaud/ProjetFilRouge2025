import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: '', component:Home},
    {path: 'contact', loadComponent:() => import('./components/contact/contact').then(m => m.Contact)},
    {path: 'profil', canActivate: [authGuard], loadComponent:() => import('./components/profil/profil').then(m => m.Profil)},
    {path: 'sign-in', loadComponent:() => import('./components/sign-in/sign-in').then(m => m.SignIn)},
    {path: 'sign-up', loadComponent:() => import('./components/sign-up/sign-up').then(m => m.SignUp)}
];
