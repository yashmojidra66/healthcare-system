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
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Dashboard</a>
              <a routerLink="/health-tracking" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Tracking</a>
              <a routerLink="/workouts" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Workouts</a>
              <a routerLink="/meal-plans" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Meals</a>
            }
            <a routerLink="/doctors" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Doctors</a>
            <a routerLink="/blog" routerLinkActive="text-primary-600 bg-primary-50" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">Blog</a>
          </div>
          <div class="flex items-center gap-2">
            @if (auth.isLoggedIn()) {
              <a routerLink="/profile" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <img [src]="auth.currentUser()?.avatar" class="w-8 h-8 rounded-full" alt="avatar">
                <span class="hidden md:block text-sm font-medium text-gray-700">{{ (auth.currentUser()?.name || 'User').split(' ')[0] }}</span>
              </a>
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
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Dashboard</a>
              <a routerLink="/health-tracking" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Health Tracking</a>
              <a routerLink="/workouts" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Workouts</a>
              <a routerLink="/meal-plans" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Meal Plans</a>
            }
            <a routerLink="/doctors" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Doctors</a>
            <a routerLink="/blog" (click)="menuOpen.set(false)" class="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Blog</a>
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


