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
        path: 'roles',
        loadComponent: () => import('../../features/dashboard/components/roles/roles.component').then(m => m.Roles)
    },
    {
        path: 'notifications',
        loadComponent: () => import('../../features/dashboard/components/notifications/notifications.component').then(m => m.Notifications)
    },
    {
        path: 'products',
        loadComponent: () => import('../../features/dashboard/components/products/products.component').then(m => m.Products)
    },
    {
        path: 'orders',
        loadComponent: () => import('../../features/dashboard/components/orders/orders.component').then(m => m.Orders)
    },
    {
        path: 'sales',
        loadComponent: () => import('../../features/dashboard/components/sales/sales.component').then(m => m.Sales)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];