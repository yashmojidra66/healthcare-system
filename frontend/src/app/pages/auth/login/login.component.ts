import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

type PortalType = 'patient' | 'doctor' | 'admin' | null;

interface Portal {
  key: PortalType;
  label: string;
  subtitle: string;
  icon: string;
  accent: string;
  accentLight: string;
  accentText: string;
  borderActive: string;
  features: string[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">

      <!-- Top bar -->
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <a routerLink="/home" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <i class="fas fa-heartbeat text-white text-sm"></i>
          </div>
          <span class="text-xl font-bold text-gray-900">Modern<span class="text-primary-600">Medicare</span></span>
        </a>
        <p class="text-sm text-gray-500">
          No account? <a routerLink="/register" class="text-primary-600 font-semibold hover:underline">Sign up free</a>
        </p>
      </div>

      <div class="flex-1 flex items-center justify-center px-4 py-8">
        <div class="w-full max-w-4xl">

          <!-- Step 1: Portal Selection -->
          @if (!selectedPortal()) {
            <div class="animate-fade-in">
              <div class="text-center mb-10">
                <div class="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
                  <i class="fas fa-lock text-xs"></i> Secure Sign In
                </div>
                <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">Choose Your Portal</h1>
                <p class="text-gray-500 text-sm sm:text-lg max-w-md mx-auto">Select the portal that matches your role to access your personalized dashboard.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                @for (portal of portals; track portal.key) {
                  <button (click)="selectPortal(portal)"
                    class="group text-left bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <div class="h-1.5" [class]="portal.accent"></div>
                    <div class="p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center" [class]="portal.accentLight">
                          <i [class]="portal.icon + ' text-xl ' + portal.accentText"></i>
                        </div>
                        <div>
                          <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ portal.label }}</h3>
                          <p class="text-xs text-gray-400">{{ portal.subtitle }}</p>
                        </div>
                      </div>
                      <ul class="space-y-2 mb-5">
                        @for (f of portal.features; track f) {
                          <li class="flex items-center gap-2 text-sm text-gray-500">
                            <i class="fas fa-check-circle text-xs" [class]="portal.accentText"></i>
                            {{ f }}
                          </li>
                        }
                      </ul>
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold" [class]="portal.accentText">Sign in as {{ portal.label }}</span>
                        <div class="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" [class]="portal.accentLight">
                          <i class="fas fa-arrow-right text-xs" [class]="portal.accentText"></i>
                        </div>
                      </div>
                    </div>
                  </button>
                }
              </div>

              <!-- Dev Quick Login -->
              <div class="mt-6 bg-gray-900/5 border border-dashed border-gray-300 rounded-2xl p-4">
                <div class="flex items-center gap-2 mb-3">
                  <i class="fas fa-code text-xs text-gray-400"></i>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dev Quick Login</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  @for (d of devAccounts; track d.label) {
                    <button (click)="devLogin(d)"
                      class="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all hover:shadow-sm"
                      [class]="d.style">
                      <i [class]="d.icon + ' text-sm'"></i>
                      <div>
                        <p class="text-xs font-bold leading-tight">{{ d.label }}</p>
                        <p class="text-xs opacity-60 leading-tight">{{ d.email }}</p>
                      </div>
                    </button>
                  }
                </div>
              </div>

            </div>
          }

          <!-- Step 2: Login Form -->
          @if (selectedPortal()) {
            <div class="animate-fade-in max-w-md mx-auto">

              <!-- Back button -->
              <button (click)="selectedPortal.set(null)" class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
                <div class="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                  <i class="fas fa-arrow-left text-xs"></i>
                </div>
                Back to portal selection
              </button>

              <!-- Portal badge -->
              <div class="flex items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center" [class]="activePortal()!.accentLight">
                  <i [class]="activePortal()!.icon + ' text-lg ' + activePortal()!.accentText"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ activePortal()!.label }} Portal</p>
                  <p class="text-xs text-gray-400">{{ activePortal()!.subtitle }}</p>
                </div>
                <div class="ml-auto">
                  <span class="text-xs font-semibold px-3 py-1 rounded-full" [class]="activePortal()!.accentLight + ' ' + activePortal()!.accentText">
                    Selected
                  </span>
                </div>
              </div>

              <!-- Card -->
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="h-1" [class]="activePortal()!.accent"></div>
                <div class="p-7">
                  <h2 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                  <p class="text-gray-500 text-sm mb-6">Sign in to your Modern Medicare account</p>

                  @if (error()) {
                    <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm flex items-center gap-2 animate-fade-in">
                      <i class="fas fa-exclamation-circle text-red-500"></i> {{ error() }}
                    </div>
                  }

                  <form (ngSubmit)="onSubmit()" #f="ngForm">
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <div class="relative">
                        <i class="fas fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input type="email" [(ngModel)]="email" name="email" required
                          class="input-field pl-10"
                          placeholder="you@example.com">
                      </div>
                    </div>

                    <div class="mb-6">
                      <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <a href="#" class="text-xs text-primary-600 hover:underline">Forgot password?</a>
                      </div>
                      <div class="relative">
                        <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input [type]="showPass() ? 'text' : 'password'" [(ngModel)]="password" name="password" required
                          class="input-field pl-10 pr-12"
                          placeholder="••••••••">
                        <button type="button" (click)="showPass.set(!showPass())"
                          class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <i [class]="showPass() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                      </div>
                    </div>

                    <button type="submit" [disabled]="loading()"
                      class="w-full py-3 px-6 font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 text-white"
                      [class]="activePortal()!.accent">
                      @if (loading()) {
                        <i class="fas fa-spinner fa-spin mr-2"></i>
                      }
                      Sign In to {{ activePortal()!.label }} Portal
                    </button>
                  </form>

                  <p class="text-center text-sm text-gray-500 mt-5">
                    Don't have an account?
                    <a routerLink="/register" class="text-primary-600 font-semibold hover:underline">Create one free</a>
                  </p>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  showPass = signal(false);
  selectedPortal = signal<PortalType>(null);

  portals: Portal[] = [
    {
      key: 'patient',
      label: 'Patient',
      subtitle: 'Personal health portal',
      icon: 'fas fa-user',
      accent: 'bg-gradient-to-r from-primary-500 to-primary-600',
      accentLight: 'bg-primary-50',
      accentText: 'text-primary-600',
      borderActive: 'border-primary-400',
      features: [
        'Book & manage appointments',
        'Track daily health metrics',
        'Meal & workout plans',
        'Mental health tools',
      ],
    },
    {
      key: 'doctor',
      label: 'Doctor',
      subtitle: 'Clinical management portal',
      icon: 'fas fa-user-md',
      accent: 'bg-gradient-to-r from-emerald-500 to-green-600',
      accentLight: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      borderActive: 'border-emerald-400',
      features: [
        'Manage patient records',
        'Schedule appointments',
        'Issue prescriptions',
        'Video consultations',
      ],
    },
    {
      key: 'admin',
      label: 'Admin',
      subtitle: 'System control panel',
      icon: 'fas fa-user-shield',
      accent: 'bg-gradient-to-r from-primary-700 to-primary-900',
      accentLight: 'bg-primary-50',
      accentText: 'text-primary-800',
      borderActive: 'border-primary-700',
      features: [
        'User & doctor management',
        'Platform analytics',
        'Report generation',
        'Security & settings',
      ],
    },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  devAccounts = [
    { label: 'Patient', email: 'user@health.com', password: 'pass1234', portal: 'patient' as PortalType, icon: 'fas fa-user', style: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
    { label: 'Doctor', email: 'doctor@health.com', password: 'pass1234', portal: 'doctor' as PortalType, icon: 'fas fa-user-md', style: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
    { label: 'Admin', email: 'admin@health.com', password: 'pass1234', portal: 'admin' as PortalType, icon: 'fas fa-user-shield', style: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
  ];

  devLogin(account: { email: string; password: string; portal: PortalType }) {
    this.selectedPortal.set(account.portal);
    this.email = account.email;
    this.password = account.password;
    this.error.set('');
    // Auto-submit after a tick so the form renders
    setTimeout(() => this.onSubmit(), 50);
  }

  activePortal() {
    return this.portals.find(p => p.key === this.selectedPortal()) ?? null;
  }

  selectPortal(portal: Portal) {
    this.selectedPortal.set(portal.key);
    this.email = '';
    this.password = '';
    this.error.set('');
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          const role = res.user?.role;
          if (role === 'admin') this.router.navigate(['/admin']);
          else if (role === 'doctor') this.router.navigate(['/doctor-portal']);
          else this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
