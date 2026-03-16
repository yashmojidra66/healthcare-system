import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HealthService } from '../../services/health.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/health.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Appointments</h1>
          <p class="text-gray-500 mt-1">Manage your medical appointments</p>
        </div>
        <button (click)="showForm.set(true)" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>Book Appointment
        </button>
      </div>
      <div class="flex gap-2 mb-6">
        @for (tab of tabs; track tab) {
          <button (click)="activeTab.set(tab)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            [class]="activeTab() === tab ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'">
            {{ tab }}
          </button>
        }
      </div>
      <div class="space-y-4">
        @for (appt of filteredAppts(); track appt.id) {
          <div class="card flex flex-col md:flex-row md:items-center gap-4">
            <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + appt.doctorName" class="w-14 h-14 rounded-full flex-shrink-0">
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="font-bold text-gray-900">{{ appt.doctorName }}</h3>
                <span class="badge badge-blue">{{ appt.specialty }}</span>
              </div>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span><i class="fas fa-calendar mr-1 text-primary-500"></i>{{ appt.date | date:'EEEE, MMM d, y' }}</span>
                <span><i class="fas fa-clock mr-1 text-primary-500"></i>{{ appt.time }}</span>
                <span><i class="fas fa-video mr-1 text-primary-500"></i>{{ appt.type }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="badge" [class]="statusClass(appt.status)">{{ appt.status }}</span>
              @if (appt.status === 'confirmed' && appt.type === 'video') {
                <button class="btn-primary text-sm py-2 px-4"><i class="fas fa-video mr-1"></i>Join</button>
              }
            </div>
          </div>
        }
        @if (filteredAppts().length === 0) {
          <div class="card text-center py-12">
            <i class="fas fa-calendar-times text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">No {{ activeTab().toLowerCase() }} appointments</p>
            <button (click)="showForm.set(true)" class="btn-primary mt-4 text-sm">Book Now</button>
          </div>
        }
      </div>
      @if (showForm()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="showForm.set(false)">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">Book Appointment</h2>
              <button (click)="showForm.set(false)" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select [(ngModel)]="form.doctorName" class="input-field">
                  @for (d of doctors(); track d.id) {
                    <option [value]="d.name">{{ d.name }} - {{ d.specialty }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" [(ngModel)]="form.date" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select [(ngModel)]="form.time" class="input-field">
                  @for (t of timeSlots; track t) { <option [value]="t">{{ t }}</option> }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select [(ngModel)]="form.type" class="input-field">
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button (click)="bookAppointment()" class="btn-primary flex-1">Confirm Booking</button>
              <button (click)="showForm.set(false)" class="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  showForm = signal(false);
  activeTab = signal('Upcoming');
  tabs = ['Upcoming', 'Completed', 'All'];
  doctors = signal<any[]>([]);
  appointmentList = signal<Appointment[]>([]);
  timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  form = { doctorName: '', date: '', time: '9:00 AM', type: 'video' as 'video' | 'in-person' | 'phone' };

  constructor(private health: HealthService, private auth: AuthService) {}

  ngOnInit(): void {
    this.health.getDoctors().subscribe((docs: any[]) => {
      this.doctors.set(docs);
      this.form.doctorName = docs[0]?.name || '';
    });
    this.health.getAppointments().subscribe((appts: Appointment[]) => this.appointmentList.set(appts));
  }

  filteredAppts(): Appointment[] {
    const tab = this.activeTab();
    const appts = this.appointmentList();
    if (tab === 'Upcoming') return appts.filter((a: Appointment) => a.status !== 'completed' && a.status !== 'cancelled');
    if (tab === 'Completed') return appts.filter((a: Appointment) => a.status === 'completed');
    return appts;
  }

  bookAppointment(): void {
    const user = this.auth.currentUser();
    if (!user || !this.form.date) return;
    const doctor = this.doctors().find((d: any) => d.name === this.form.doctorName);
    const apptData: Partial<Appointment> = {
      doctorId: doctor?.id || doctor?._id || 'd1',
      doctorName: this.form.doctorName,
      specialty: doctor?.specialty || 'General',
      date: new Date(this.form.date),
      time: this.form.time,
      type: this.form.type,
      status: 'pending'
    };
    this.health.createAppointment(apptData).subscribe({
      next: (appt: Appointment) => {
        this.appointmentList.update((a: Appointment[]) => [appt, ...a]);
        this.showForm.set(false);
      }
    });
  }

  statusClass(s: string): string {
    const m: Record<string, string> = { confirmed: 'badge-green', pending: 'badge-orange', completed: 'badge-blue', cancelled: 'badge-red' };
    return m[s] || 'badge-blue';
  }
}