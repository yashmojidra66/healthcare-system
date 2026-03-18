import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // ── Public pages (navbar + footer layout) ─────────────────────────────────
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors.component').then(m => m.DoctorsComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
  },

  // ── Patient portal (left sidebar layout, auth required) ───────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/patient-layout/patient-layout.component').then(m => m.PatientLayoutComponent),
    children: [
      { path: 'dashboard',       loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'health-tracking', loadComponent: () => import('./pages/health-tracking/health-tracking.component').then(m => m.HealthTrackingComponent) },
      { path: 'meal-plans',      loadComponent: () => import('./pages/meal-plans/meal-plans.component').then(m => m.MealPlansComponent) },
      { path: 'workouts',        loadComponent: () => import('./pages/workouts/workouts.component').then(m => m.WorkoutsComponent) },
      { path: 'appointments',    loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent) },
      { path: 'community',       loadComponent: () => import('./pages/community/community.component').then(m => m.CommunityComponent) },
      { path: 'profile',         loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },

  // ── Isolated portals ───────────────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'doctor-portal',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['doctor', 'admin'] },
    loadComponent: () => import('./pages/doctor-portal/doctor-portal.component').then(m => m.DoctorPortalComponent)
  },

  { path: '**', redirectTo: '/home' }
];
