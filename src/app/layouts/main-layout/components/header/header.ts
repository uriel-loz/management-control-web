import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/landing/services/auth.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { User } from '../../../../features/landing/interfaces/login.interface';

@Component({
  selector: 'layout-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  currentUser: User | null = null;
  isMenuOpen = false;

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  toggleUserMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');
    
    if (!userMenu && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  onLogout(): void {
    this.authService.onLogout().subscribe({
      next: () => {
        localStorage.clear();
        this.snackbarService.success('Sesión cerrada exitosamente');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        localStorage.removeItem('user');
        this.router.navigate(['']);
      }
    });
  }
}
