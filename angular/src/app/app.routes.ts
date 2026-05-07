import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
import { Profil } from './components/profil/profil';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [
    {path: '', component:Home},
    {path: 'contact', component:Contact},
    {path: 'profil', component:Profil},
    {path: 'sign-in', component:SignIn},
    {path: 'sign-up', component:SignUp},
];
