import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';
import { Appointment } from '../../models/health.model';
import { environment } from '../../../environments/environment';

const DOCTOR_IMG = 'https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg';

type DTab = 'dashboard' | 'appointments' | 'patients' | 'profile';

@Component({
  selector: 'app-doctor-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex h-screen bg-gray-50 overflow-hidden">

  <!-- Mobile overlay -->
  @if (mobileOpen()) {
    <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" (click)="mobileOpen.set(false)"></div>
  }

  <!-- SIDEBAR -->
  <aside [class]="mobileOpen() ? 'fixed z-50 translate-x-0' : 'fixed z-50 -translate-x-full lg:relative lg:translate-x-0'"
    class="w-64 flex-shrink-0 bg-white flex flex-col border-r border-gray-200 shadow-sm transition-transform duration-300 h-full">
    <!-- Logo -->
    <div class="flex items-center justify-between gap-3 px-5 py-5 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="fas fa-user-md text-white text-sm"></i>
        </div>
        <div>
          <p class="text-gray-900 font-bold text-sm leading-tight">Modern Medicare</p>
          <p class="text-gray-400 text-xs">Doctor Portal</p>
        </div>
      </div>
      <button (click)="mobileOpen.set(false)" class="lg:hidden text-gray-400 hover:text-gray-600 p-1">
        <i class="fas fa-times text-sm"></i>
      </button>
    </div>

    <!-- Doctor info -->
    <div class="px-5 py-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <img [src]="docAvatar()"
          class="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover flex-shrink-0">
        <div class="min-w-0">
          <p class="text-gray-900 text-sm font-semibold truncate">{{ auth.currentUser()?.name }}</p>
          <p class="text-emerald-600 text-xs">{{ auth.currentUser()?.specialty || 'Doctor' }}</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      @for (item of navItems; track item.id) {
        <button (click)="setTab(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          [class]="activeTab() === item.id
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'">
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
    <div class="px-3 py-4 border-t border-gray-100">
      <button (click)="logout()"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 transition-all">
        <i class="fas fa-sign-out-alt w-4 text-center"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3 min-w-0">
        <button (click)="mobileOpen.set(true)" class="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 flex-shrink-0">
          <i class="fas fa-bars text-sm"></i>
        </button>
        <div class="min-w-0">
          <h1 class="text-gray-900 font-bold text-base sm:text-lg truncate">{{ currentLabel() }}</h1>
          <p class="text-gray-400 text-xs hidden sm:block">{{ today }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <span class="hidden sm:flex text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-medium items-center gap-1">
          <i class="fas fa-circle text-xs"></i>Active
        </span>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto bg-gray-50 p-6">

      <!-- ── DASHBOARD ── -->
      @if (activeTab() === 'dashboard') {
        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          @for (s of stats(); track s.label) {
            <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" [class]="s.bg">
                <i [class]="s.icon + ' ' + s.color"></i>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ s.value }}</p>
                <p class="text-xs text-gray-500">{{ s.label }}</p>
              </div>
            </div>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Today's appointments -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-900 font-bold">Today's Appointments</h3>
              <button (click)="activeTab.set('appointments')" class="text-xs text-emerald-600 hover:text-emerald-700">View all</button>
            </div>
            <div class="space-y-3">
              @for (appt of todayAppointments(); track appt.id) {
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png" class="w-9 h-9 rounded-full object-cover bg-blue-50">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ apptPatientName(appt) }}</p>
                    <p class="text-xs text-gray-400">{{ appt.time }} · {{ appt.type }}</p>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                </div>
              }
              @if (todayAppointments().length === 0) {
                <p class="text-gray-400 text-sm text-center py-6">No appointments today</p>
              }
            </div>
          </div>

          <!-- Profile summary -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-gray-900 font-bold mb-4">My Profile</h3>
            <div class="flex items-center gap-4 mb-4">
              <img [src]="docAvatar()" class="w-16 h-16 rounded-2xl border-2 border-emerald-400 object-cover">
              <div>
                <p class="text-gray-900 font-bold">{{ auth.currentUser()?.name }}</p>
                <p class="text-emerald-600 text-sm">{{ auth.currentUser()?.specialty || 'General Physician' }}</p>
                <p class="text-gray-400 text-xs">{{ auth.currentUser()?.hospital || 'Modern Medicare' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p class="text-gray-900 font-bold">{{ auth.currentUser()?.experience || '—' }}</p>
                <p class="text-xs text-gray-500">Yrs Experience</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p class="text-gray-900 font-bold">\${{ auth.currentUser()?.consultationFee || '—' }}</p>
                <p class="text-xs text-gray-500">Consultation Fee</p>
              </div>
            </div>
            <button (click)="activeTab.set('profile')" class="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      }

      <!-- ── APPOINTMENTS ── -->
      @if (activeTab() === 'appointments') {
        <!-- Filter tabs -->
        <div class="flex gap-2 mb-4">
          @for (tab of apptTabs; track tab) {
            <button (click)="apptFilter.set(tab)"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all"
              [class]="apptFilter() === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'">
              {{ tab }}
              @if (tab !== 'All') {
                <span class="ml-1.5 text-xs opacity-75">({{ countByStatus(tab) }})</span>
              }
            </button>
          }
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-gray-900 font-bold">My Appointments</h3>
            <span class="text-sm text-gray-400">{{ filteredAppointments().length }} shown</span>
          </div>
          @if (filteredAppointments().length === 0) {
            <div class="text-center py-16">
              <i class="fas fa-calendar-times text-4xl text-gray-200 mb-3"></i>
              <p class="text-gray-400">No {{ apptFilter().toLowerCase() }} appointments</p>
            </div>
          } @else {
            <div class="divide-y divide-gray-100">
              @for (appt of filteredAppointments(); track appt.id) {
                <div class="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png" class="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-blue-50 mt-0.5">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ apptPatientName(appt) }}</p>
                      <span class="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{{ appt.type }}</span>
                    </div>
                    <p class="text-gray-400 text-xs">{{ appt.date | date:'EEE, MMM d, y' }} at {{ appt.time }} · {{ appt.specialty }}</p>
                    @if (apptNotes(appt)) {
                      <p class="text-gray-500 text-xs mt-1 italic">"{{ apptNotes(appt) }}"</p>
                    }
                  </div>
                  <div class="flex flex-col items-end gap-2 flex-shrink-0">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                    <div class="flex gap-1.5">
                      @if (appt.status === 'pending') {
                        <button (click)="updateAppt(apptId(appt), 'confirmed')"
                          class="text-xs bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors font-medium">
                          <i class="fas fa-check mr-1"></i>Confirm
                        </button>
                        <button (click)="updateAppt(apptId(appt), 'cancelled')"
                          class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors font-medium">
                          <i class="fas fa-times mr-1"></i>Cancel
                        </button>
                      }
                      @if (appt.status === 'confirmed') {
                        <button (click)="updateAppt(apptId(appt), 'completed')"
                          class="text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors font-medium">
                          <i class="fas fa-check-double mr-1"></i>Complete
                        </button>
                        <button (click)="updateAppt(apptId(appt), 'cancelled')"
                          class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-lg transition-colors font-medium">
                          <i class="fas fa-times mr-1"></i>Cancel
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ── PATIENTS ── -->
      @if (activeTab() === 'patients') {
        <!-- Search bar -->
        <div class="mb-4">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input [(ngModel)]="patientSearch" type="text" placeholder="Search patients by name..."
              class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400">
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-gray-900 font-bold">My Patients</h3>
            <span class="text-sm text-gray-400">{{ filteredPatients().length }} patients</span>
          </div>

          @if (filteredPatients().length === 0) {
            <div class="text-center py-16">
              <i class="fas fa-users text-4xl text-gray-200 mb-3"></i>
              <p class="text-gray-400">No patients found</p>
            </div>
          } @else {
            <div class="divide-y divide-gray-100">
              @for (p of filteredPatients(); track p.userId) {
                <div class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  (click)="selectPatient(p)">
                  <img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
                    class="w-11 h-11 rounded-full object-cover bg-blue-50 flex-shrink-0">
                  <div class="flex-1 min-w-0">
                    <p class="text-gray-900 font-semibold text-sm">{{ p.name }}</p>
                    <p class="text-gray-400 text-xs mt-0.5">
                      {{ p.totalAppts }} appointment{{ p.totalAppts !== 1 ? 's' : '' }} ·
                      Last visit: {{ p.lastVisit | date:'MMM d, y' }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                      [class]="p.lastStatus === 'completed' ? 'bg-blue-50 text-blue-600' :
                               p.lastStatus === 'confirmed' ? 'bg-green-50 text-green-600' :
                               p.lastStatus === 'pending'   ? 'bg-orange-50 text-orange-600' :
                               'bg-gray-100 text-gray-500'">
                      {{ p.lastStatus }}
                    </span>
                    <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ── PROFILE ── -->
      @if (activeTab() === 'profile') {
        <div class="max-w-xl">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 class="text-gray-900 font-bold mb-5">My Profile</h3>
            <div class="flex items-center gap-4 mb-6">
              <img [src]="docAvatar()" class="w-16 h-16 rounded-2xl border-2 border-emerald-400 object-cover">
              <div>
                <p class="text-gray-900 font-bold text-lg">{{ auth.currentUser()?.name }}</p>
                <p class="text-emerald-600">{{ auth.currentUser()?.email }}</p>
              </div>
            </div>
            <div class="space-y-3">
              @for (field of profileFields(); track field.label) {
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span class="text-gray-500 text-sm">{{ field.label }}</span>
                  <span class="text-gray-900 text-sm font-medium">{{ field.value || '—' }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

    </main>
  </div>

  <!-- Patient detail modal -->
  @if (selectedPatient()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selectedPatient.set(null)">
      <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-gray-900 font-bold text-lg">Patient Details</h2>
          <button (click)="selectedPatient.set(null)" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <!-- Patient info -->
        <div class="px-6 py-5">
          <div class="flex items-center gap-4 mb-5">
            <img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
              class="w-16 h-16 rounded-2xl object-cover bg-blue-50 border-2 border-blue-100">
            <div>
              <p class="text-gray-900 font-bold text-lg">{{ selectedPatient()!.name }}</p>
              <p class="text-gray-400 text-sm">{{ selectedPatient()!.totalAppts }} total appointments</p>
            </div>
          </div>
          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-3 mb-5">
            <div class="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
              <p class="text-emerald-700 font-bold text-lg">{{ selectedPatient()!.completedAppts }}</p>
              <p class="text-xs text-emerald-600">Completed</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
              <p class="text-orange-700 font-bold text-lg">{{ selectedPatient()!.pendingAppts }}</p>
              <p class="text-xs text-orange-600">Pending</p>
            </div>
            <div class="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <p class="text-blue-700 font-bold text-lg">{{ selectedPatient()!.confirmedAppts }}</p>
              <p class="text-xs text-blue-600">Confirmed</p>
            </div>
          </div>
          <!-- Appointment history -->
          <h4 class="text-gray-700 font-semibold text-sm mb-3">Appointment History</h4>
          <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
            @for (appt of selectedPatient()!.appointments; track appt.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p class="text-gray-900 text-sm font-medium">{{ appt.date | date:'EEE, MMM d, y' }} · {{ appt.time }}</p>
                  <p class="text-gray-400 text-xs mt-0.5">{{ appt.type }}{{ apptNotes(appt) ? ' — ' + apptNotes(appt) : '' }}</p>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2" [class]="apptPill(appt.status)">{{ appt.status }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  }

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
  mobileOpen = signal(false);

  today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  navItems = [
    { id: 'dashboard' as DTab, label: 'Dashboard', icon: 'fas fa-chart-pie' },
    { id: 'appointments' as DTab, label: 'Appointments', icon: 'fas fa-calendar-alt' },
    { id: 'patients' as DTab, label: 'Patients', icon: 'fas fa-users' },
    { id: 'profile' as DTab, label: 'My Profile', icon: 'fas fa-user' },
  ];

  stats = signal([
    { label: 'Today\'s Appts', value: '0', icon: 'fas fa-calendar-day', bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { label: 'Total Appts', value: '0', icon: 'fas fa-calendar-check', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Pending', value: '0', icon: 'fas fa-clock', bg: 'bg-orange-100', color: 'text-orange-600' },
    { label: 'Completed', value: '0', icon: 'fas fa-check-circle', bg: 'bg-purple-100', color: 'text-purple-600' },
  ]);

  apptTabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  apptFilter = signal('All');
  patientSearch = '';
  selectedPatient = signal<any>(null);

  filteredAppointments() {
    const f = this.apptFilter().toLowerCase();
    if (f === 'all') return this.appointments();
    return this.appointments().filter(a => a.status === f);
  }

  countByStatus(tab: string) {
    return this.appointments().filter(a => a.status === tab.toLowerCase()).length;
  }

  constructor(public auth: AuthService, private health: HealthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.health.getAppointments().subscribe((appts: Appointment[]) => {
      this.appointments.set(appts);
      const today = new Date().toDateString();
      const todayCount = appts.filter(a => new Date(a.date).toDateString() === today).length;
      const pending = appts.filter(a => a.status === 'pending').length;
      const completed = appts.filter(a => a.status === 'completed').length;
      this.stats.set([
        { label: 'Today\'s Appts', value: String(todayCount), icon: 'fas fa-calendar-day', bg: 'bg-emerald-100', color: 'text-emerald-600' },
        { label: 'Total Appts', value: String(appts.length), icon: 'fas fa-calendar-check', bg: 'bg-blue-100', color: 'text-blue-600' },
        { label: 'Pending', value: String(pending), icon: 'fas fa-clock', bg: 'bg-orange-100', color: 'text-orange-600' },
        { label: 'Completed', value: String(completed), icon: 'fas fa-check-circle', bg: 'bg-purple-100', color: 'text-purple-600' },
      ]);
    });
  }

  currentLabel() {
    return this.navItems.find(n => n.id === this.activeTab())?.label || 'Dashboard';
  }

  setTab(id: DTab) {
    this.activeTab.set(id);
    this.mobileOpen.set(false);
  }

  todayAppointments() {
    const today = new Date().toDateString();
    return this.appointments().filter(a => new Date(a.date).toDateString() === today);
  }

  todayCount() { return this.todayAppointments().length; }

  apptId(appt: any): string { return appt._id || appt.id; }

  updateAppt(id: string, status: string) {
    this.http.put<any>(`${this.api}/appointments/${id}`, { status }).subscribe({
      next: () => {
        this.appointments.update(list => list.map(a => (a as any)._id === id || a.id === id ? { ...a, status: status as any } : a));
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

  apptPatientName(appt: Appointment): string {
    return (appt as any).patientName || 'Patient';
  }

  // Build unique patient list from appointments
  patients(): any[] {
    const map = new Map<string, any>();
    for (const appt of this.appointments()) {
      const uid = String((appt as any).userId || '');
      const name = (appt as any).patientName || 'Patient';
      if (!map.has(uid)) {
        map.set(uid, { userId: uid, name, appointments: [], totalAppts: 0, completedAppts: 0, pendingAppts: 0, confirmedAppts: 0, lastVisit: appt.date, lastStatus: appt.status });
      }
      const p = map.get(uid);
      p.appointments.push(appt);
      p.totalAppts++;
      if (appt.status === 'completed') p.completedAppts++;
      if (appt.status === 'pending') p.pendingAppts++;
      if (appt.status === 'confirmed') p.confirmedAppts++;
      if (new Date(appt.date) > new Date(p.lastVisit)) { p.lastVisit = appt.date; p.lastStatus = appt.status; }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
  }

  filteredPatients(): any[] {
    const q = this.patientSearch.toLowerCase().trim();
    return q ? this.patients().filter(p => p.name.toLowerCase().includes(q)) : this.patients();
  }

  selectPatient(p: any) {
    this.selectedPatient.set({ ...p, appointments: [...p.appointments].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) });
  }

  apptNotes(appt: Appointment): string {
    return (appt as any).notes || '';
  }

  docAvatar(): string {
    return (this.auth.currentUser() as any)?.avatar || DOCTOR_IMG;
  }

  apptPill(status: string) {
    const m: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-600',
      completed: 'bg-blue-100 text-blue-600',
      cancelled: 'bg-red-100 text-red-500'
    };
    return m[status] || 'bg-gray-100 text-gray-500';
  }
}
