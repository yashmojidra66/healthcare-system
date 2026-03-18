import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

const PATIENT_IMG = 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png';
interface NavItem { path: string; label: string; icon: string; }

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<div class="flex h-screen bg-gray-50 overflow-hidden">

  <!-- Mobile overlay -->
  @if (mobileOpen()) {
    <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" (click)="mobileOpen.set(false)"></div>
  }

  <!-- SIDEBAR -->
  <aside [class]="sidebarClasses()"
    class="fixed lg:relative z-50 lg:z-auto flex-shrink-0 bg-white flex flex-col border-r border-gray-200 shadow-sm transition-all duration-300 h-full">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100 overflow-hidden">
      <div class="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
        <i class="fas fa-heartbeat text-white text-sm"></i>
      </div>
      @if (isExpanded()) {
        <div class="min-w-0 flex-1">
          <p class="text-gray-900 font-bold text-sm leading-tight">Modern Medicare</p>
          <p class="text-gray-400 text-xs">Patient Portal</p>
        </div>
        <button (click)="closeSidebar()" class="lg:hidden text-gray-400 hover:text-gray-600 p-1">
          <i class="fas fa-times text-sm"></i>
        </button>
      }
    </div>

    <!-- User info -->
    @if (isExpanded()) {
      <div class="px-4 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="relative flex-shrink-0">
            <img [src]="PATIENT_IMG" class="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white bg-blue-50">
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div class="min-w-0">
            <p class="text-gray-900 text-sm font-semibold truncate">{{ auth.currentUser()?.name || 'Patient' }}</p>
            <p class="text-primary-500 text-xs font-medium">Patient</p>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex justify-center py-4 border-b border-gray-100">
        <div class="relative">
          <img [src]="PATIENT_IMG" class="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-white bg-blue-50">
          <span class="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
      </div>
    }

    <!-- Nav -->
    <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      @for (item of navItems; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="bg-primary-50 text-primary-700 border border-primary-200"
          (click)="mobileOpen.set(false)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          [title]="!isExpanded() ? item.label : ''">
          <i [class]="item.icon + ' w-4 text-center flex-shrink-0'"></i>
          @if (isExpanded()) { <span>{{ item.label }}</span> }
        </a>
      }
    </nav>

    <!-- Toggle + Logout -->
    <div class="px-2 py-4 border-t border-gray-100 space-y-1">
      <button (click)="sidebarOpen.set(!sidebarOpen())"
        class="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
        <i [class]="(sidebarOpen() ? 'fas fa-chevron-left' : 'fas fa-chevron-right') + ' w-4 text-center flex-shrink-0'"></i>
        @if (sidebarOpen()) { <span>Collapse</span> }
      </button>
      <button (click)="auth.logout()"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 transition-all">
        <i class="fas fa-sign-out-alt w-4 text-center flex-shrink-0"></i>
        @if (isExpanded()) { <span>Logout</span> }
      </button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Mobile hamburger -->
        <button (click)="mobileOpen.set(true)" class="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 flex-shrink-0">
          <i class="fas fa-bars text-sm"></i>
        </button>
        <div class="min-w-0">
          <h1 class="text-gray-900 font-bold text-base sm:text-lg truncate">{{ currentLabel() }}</h1>
          <p class="text-gray-400 text-xs hidden sm:block">{{ today }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="hidden sm:flex text-xs bg-primary-50 text-primary-600 border border-primary-200 px-3 py-1 rounded-full font-medium items-center gap-1">
          <i class="fas fa-circle text-xs"></i>Patient
        </span>
        <a routerLink="/profile"
          class="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors">
          <img [src]="PATIENT_IMG" class="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-primary-100 bg-blue-50">
          <span class="text-sm font-medium text-gray-700 hidden sm:block">
            {{ (auth.currentUser()?.name || 'Patient').split(' ')[0] }}
          </span>
        </a>
      </div>
    </header>
    <main class="flex-1 overflow-y-auto bg-gray-50">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
  `
})
export class PatientLayoutComponent {
  PATIENT_IMG = PATIENT_IMG;
  sidebarOpen = signal(true);
  mobileOpen = signal(false);
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  navItems: NavItem[] = [
    { path: '/dashboard',       label: 'Dashboard',       icon: 'fas fa-th-large' },
    { path: '/appointments',    label: 'Appointments',    icon: 'fas fa-calendar-alt' },
    { path: '/workouts',        label: 'Workout Plans',   icon: 'fas fa-dumbbell' },
    { path: '/meal-plans',      label: 'Meal Plans',      icon: 'fas fa-utensils' },
    { path: '/health-tracking', label: 'Health Tracking', icon: 'fas fa-heartbeat' },
    { path: '/community',       label: 'Community',       icon: 'fas fa-users' },
    { path: '/profile',         label: 'Profile',         icon: 'fas fa-user-circle' },
  ];

  constructor(public auth: AuthService) {}

  isExpanded(): boolean {
    return this.mobileOpen() || this.sidebarOpen();
  }

  sidebarClasses(): string {
    if (this.mobileOpen()) return 'w-64 translate-x-0';
    // desktop
    return this.sidebarOpen() ? 'w-64 -translate-x-full lg:translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0';
  }

  closeSidebar() {
    this.mobileOpen.set(false);
  }

  currentLabel(): string {
    const path = window.location.pathname;
    return this.navItems.find(n => n.path === path)?.label ?? 'Patient Portal';
  }
}
