import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('../../features/dashboard/components/home/home.component').then(m => m.Home)
    },
    {
        path: 'users',
        loadComponent: () => import('../../features/dashboard/components/users/users.component').then(m => m.Users)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];