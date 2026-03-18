import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/home" class="flex items-center gap-2">
            <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <i class="fas fa-heartbeat text-white text-sm"></i>
            </div>
            <span class="text-xl font-bold text-gray-900">Modern<span class="text-primary-600">Medicare</span></span>
          </a>
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/home" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Home</a>
            <a routerLink="/doctors" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Doctors</a>
            <a routerLink="/blog" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Blog</a>
          </div>
          <div class="flex items-center gap-2">
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">Dashboard</a>
              <button (click)="auth.logout()" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">Logout</button>
            } @else {
              <a routerLink="/login" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Login</a>
              <a routerLink="/register" class="btn-primary text-sm">Get Started</a>
            }
            <button (click)="menuOpen.set(!menuOpen())" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i class="fas" [class.fa-bars]="!menuOpen()" [class.fa-times]="menuOpen()"></i>
            </button>
          </div>
        </div>
        @if (menuOpen()) {
          <div class="md:hidden border-t border-gray-100 py-3 space-y-1">
            <a routerLink="/home" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Home</a>
            <a routerLink="/doctors" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Doctors</a>
            <a routerLink="/blog" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Blog</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Dashboard</a>
            }
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  menuOpen = signal(false);
  constructor(public auth: AuthService) {}
}
