import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/components/login/login.component').then(m => m.LoginComponent),
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayout),
        loadChildren: () => import('./layouts/main-layout/layout.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
