import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/components/login/login-component').then(m => m.LoginComponent),
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        loadChildren: () => import('./layouts/main-layout/layout.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
