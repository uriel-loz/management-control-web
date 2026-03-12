import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'recovery-password',
        loadComponent: () => import('./components/recovery-password/recovery-password.component').then(m => m.RecoveryPasswordComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];