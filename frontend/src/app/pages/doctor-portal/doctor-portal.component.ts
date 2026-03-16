import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';
import { Appointment } from '../../models/health.model';
import { environment } from '../../../environments/environment';

type DTab = 'dashboard' | 'appointments' | 'patients' | 'profile';

@Component({
  selector: 'app-doctor-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex h-screen bg-gray-950 overflow-hidden">

  <!-- SIDEBAR -->
  <aside class="w-64 flex-shrink-0 bg-gray-900 flex flex-col border-r border-gray-800">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
      <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center">
        <i class="fas fa-user-md text-white text-sm"></i>
      </div>
      <div>
        <p class="text-white font-bold text-sm leading-tight">HealthCare+</p>
        <p class="text-gray-400 text-xs">Doctor Portal</p>
      </div>
    </div>

    <!-- Doctor info -->
    <div class="px-5 py-4 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <img [src]="auth.currentUser()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor'"
          class="w-10 h-10 rounded-full border-2 border-emerald-500">
        <div class="min-w-0">
          <p class="text-white text-sm font-semibold truncate">{{ auth.currentUser()?.name }}</p>
          <p class="text-emerald-400 text-xs">{{ auth.currentUser()?.specialty || 'Doctor' }}</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      @for (item of navItems; track item.id) {
        <button (click)="activeTab.set(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          [class]="activeTab() === item.id
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'">
          <i [class]="item.icon + ' w-4 text-center'"></i>
          <span>{{ item.label }}</span>
          @if (item.id === 'appointments' && todayCount() > 0) {
            <span class="ml-auto bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ todayCount() }}
            </span>
          }
        </button>
      }
    </nav>

    <!-- Logout -->
    <div class="px-3 py-4 border-t border-gray-800">
      <button (click)="logout()"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 transition-all">
        <i class="fas fa-sign-out-alt w-4 text-center"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top bar -->
    <header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 class="text-white font-bold text-lg">{{ currentLabel() }}</h1>
        <p class="text-gray-500 text-xs">{{ today }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">
          <i class="fas fa-circle text-xs mr-1"></i>Active
        </span>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto bg-gray-950 p-6">

      <!-- ── DASHBOARD ── -->
      @if (activeTab() === 'dashboard') {
        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          @for (s of stats(); track s.label) {
            <div class="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" [class]="s.bg">
                <i [class]="s.icon + ' ' + s.color"></i>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ s.value }}</p>
                <p class="text-xs text-gray-500">{{ s.label }}</p>
              </div>
            </div>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Today's appointments -->
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold">Today's Appointments</h3>
              <button (click)="activeTab.set('appointments')" class="text-xs text-emerald-400 hover:text-emerald-300">View all</button>
            </div>
            <div class="space-y-3">
              @for (appt of todayAppointments(); track appt.id) {
                <div class="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=patient'+appt.id" class="w-9 h-9 rounded-full">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate">{{ appt.doctorName }}</p>
                    <p class="text-xs text-gray-400">{{ appt.time }} · {{ appt.type }}</p>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                </div>
              }
              @if (todayAppointments().length === 0) {
                <p class="text-gray-600 text-sm text-center py-6">No appointments today</p>
              }
            </div>
          </div>

          <!-- Profile summary -->
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 class="text-white font-bold mb-4">My Profile</h3>
            <div class="flex items-center gap-4 mb-4">
              <img [src]="auth.currentUser()?.avatar" class="w-16 h-16 rounded-2xl border-2 border-emerald-500">
              <div>
                <p class="text-white font-bold">{{ auth.currentUser()?.name }}</p>
                <p class="text-emerald-400 text-sm">{{ auth.currentUser()?.specialty || 'General Physician' }}</p>
                <p class="text-gray-500 text-xs">{{ auth.currentUser()?.hospital || 'Healthcare+' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-800 rounded-xl p-3 text-center">
                <p class="text-white font-bold">{{ auth.currentUser()?.experience || '—' }}</p>
                <p class="text-xs text-gray-500">Yrs Experience</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-3 text-center">
                <p class="text-white font-bold">\${{ auth.currentUser()?.consultationFee || '—' }}</p>
                <p class="text-xs text-gray-500">Consultation Fee</p>
              </div>
            </div>
            <button (click)="activeTab.set('profile')" class="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      }

      <!-- ── APPOINTMENTS ── -->
      @if (activeTab() === 'appointments') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 class="text-white font-bold">My Appointments</h3>
            <span class="text-sm text-gray-500">{{ appointments().length }} total</span>
          </div>
          @if (appointments().length === 0) {
            <p class="text-center text-gray-600 py-16">No appointments yet</p>
          } @else {
            <div class="divide-y divide-gray-800">
              @for (appt of appointments(); track appt.id) {
                <div class="flex items-center gap-4 p-4 hover:bg-gray-800/40 transition-colors">
                  <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=patient'+appt.id" class="w-10 h-10 rounded-full flex-shrink-0">
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-semibold text-sm">Patient Appointment</p>
                    <p class="text-gray-400 text-xs">{{ appt.date | date:'MMM d, y' }} at {{ appt.time }} · {{ appt.specialty }}</p>
                  </div>
                  <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full hidden sm:block">{{ appt.type }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                  <div class="flex gap-2">
                    @if (appt.status === 'pending') {
                      <button (click)="updateAppt(appt.id, 'confirmed')" class="text-xs bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Confirm</button>
                      <button (click)="updateAppt(appt.id, 'cancelled')" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Cancel</button>
                    }
                    @if (appt.status === 'confirmed') {
                      <button (click)="updateAppt(appt.id, 'completed')" class="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Complete</button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ── PATIENTS ── -->
      @if (activeTab() === 'patients') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          <i class="fas fa-users text-5xl text-gray-700 mb-4"></i>
          <p class="text-white font-bold text-lg">Patient Records</p>
          <p class="text-gray-500 mt-1">Patient management coming soon</p>
        </div>
      }

      <!-- ── PROFILE ── -->
      @if (activeTab() === 'profile') {
        <div class="max-w-xl">
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 class="text-white font-bold mb-5">My Profile</h3>
            <div class="flex items-center gap-4 mb-6">
              <img [src]="auth.currentUser()?.avatar" class="w-16 h-16 rounded-2xl border-2 border-emerald-500">
              <div>
                <p class="text-white font-bold text-lg">{{ auth.currentUser()?.name }}</p>
                <p class="text-emerald-400">{{ auth.currentUser()?.email }}</p>
              </div>
            </div>
            <div class="space-y-4">
              @for (field of profileFields(); track field.label) {
                <div class="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                  <span class="text-gray-400 text-sm">{{ field.label }}</span>
                  <span class="text-white text-sm font-medium">{{ field.value || '—' }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

    </main>
  </div>

  <!-- Toast -->
  @if (toast()) {
    <div class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium"
      [class]="toastOk() ? 'bg-green-600' : 'bg-red-600'">
      {{ toast() }}
    </div>
  }
</div>
  `
})
export class DoctorPortalComponent implements OnInit {
  private api = environment.apiUrl;
  activeTab = signal<DTab>('dashboard');
  appointments = signal<Appointment[]>([]);
  toast = signal('');
  toastOk = signal(true);

  today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  navItems = [
    { id: 'dashboard' as DTab, label: 'Dashboard', icon: 'fas fa-chart-pie' },
    { id: 'appointments' as DTab, label: 'Appointments', icon: 'fas fa-calendar-alt' },
    { id: 'patients' as DTab, label: 'Patients', icon: 'fas fa-users' },
    { id: 'profile' as DTab, label: 'My Profile', icon: 'fas fa-user' },
  ];

  stats = signal([
    { label: 'Today\'s Appts', value: '0', icon: 'fas fa-calendar-day', bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
    { label: 'Total Appts', value: '0', icon: 'fas fa-calendar-check', bg: 'bg-blue-500/20', color: 'text-blue-400' },
    { label: 'Pending', value: '0', icon: 'fas fa-clock', bg: 'bg-orange-500/20', color: 'text-orange-400' },
    { label: 'Completed', value: '0', icon: 'fas fa-check-circle', bg: 'bg-purple-500/20', color: 'text-purple-400' },
  ]);

  constructor(public auth: AuthService, private health: HealthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.health.getAppointments().subscribe((appts: Appointment[]) => {
      this.appointments.set(appts);
      const today = new Date().toDateString();
      const todayCount = appts.filter(a => new Date(a.date).toDateString() === today).length;
      const pending = appts.filter(a => a.status === 'pending').length;
      const completed = appts.filter(a => a.status === 'completed').length;
      this.stats.set([
        { label: 'Today\'s Appts', value: String(todayCount), icon: 'fas fa-calendar-day', bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
        { label: 'Total Appts', value: String(appts.length), icon: 'fas fa-calendar-check', bg: 'bg-blue-500/20', color: 'text-blue-400' },
        { label: 'Pending', value: String(pending), icon: 'fas fa-clock', bg: 'bg-orange-500/20', color: 'text-orange-400' },
        { label: 'Completed', value: String(completed), icon: 'fas fa-check-circle', bg: 'bg-purple-500/20', color: 'text-purple-400' },
      ]);
    });
  }

  currentLabel() {
    return this.navItems.find(n => n.id === this.activeTab())?.label || 'Dashboard';
  }

  todayAppointments() {
    const today = new Date().toDateString();
    return this.appointments().filter(a => new Date(a.date).toDateString() === today);
  }

  todayCount() { return this.todayAppointments().length; }

  updateAppt(id: string, status: string) {
    this.http.put<any>(`${this.api}/appointments/${id}`, { status }).subscribe({
      next: () => {
        this.appointments.update(list => list.map(a => a.id === id ? { ...a, status: status as any } : a));
        this.showToast(`Appointment ${status}`, true);
      },
      error: () => this.showToast('Update failed', false)
    });
  }

  profileFields() {
    const u = this.auth.currentUser() as any;
    return [
      { label: 'Specialty', value: u?.specialty },
      { label: 'Hospital', value: u?.hospital },
      { label: 'Experience', value: u?.experience ? `${u.experience} years` : null },
      { label: 'Consultation Fee', value: u?.consultationFee ? `$${u.consultationFee}` : null },
      { label: 'Email', value: u?.email },
    ];
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  showToast(msg: string, ok: boolean) {
    this.toast.set(msg); this.toastOk.set(ok);
    setTimeout(() => this.toast.set(''), 3000);
  }

  apptPill(status: string) {
    const m: Record<string, string> = {
      confirmed: 'bg-green-500/20 text-green-400',
      pending: 'bg-orange-500/20 text-orange-400',
      completed: 'bg-blue-500/20 text-blue-400',
      cancelled: 'bg-red-500/20 text-red-400'
    };
    return m[status] || 'bg-gray-500/20 text-gray-400';
  }
}
