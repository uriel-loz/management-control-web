import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('../../features/dashboard/components/home/home').then(m => m.Home)
    },
    {
        path: 'users',
        loadComponent: () => import('../../features/dashboard/components/users/users').then(m => m.Users)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];