import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';
import { AuthService } from '../../services/auth.service';
import { HealthLog } from '../../models/health.model';

@Component({
  selector: 'app-health-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Health Tracking</h1>
          <p class="text-gray-500 mt-1 text-sm sm:text-base">Monitor your daily health metrics</p>
        </div>
        <button (click)="showForm.set(!showForm())" class="btn-primary self-start text-sm sm:text-base">
          <i class="fas fa-plus mr-2"></i>Log Today
        </button>
      </div>

      <!-- Log Form -->
      @if (showForm()) {
        <div class="card mb-6 md:mb-8 animate-slide-up">
          <h3 class="font-bold text-gray-900 mb-4">Add Health Log</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input type="number" [(ngModel)]="form.calories" class="input-field" placeholder="2000">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Water (ml)</label>
              <input type="number" [(ngModel)]="form.water" class="input-field" placeholder="2500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Steps</label>
              <input type="number" [(ngModel)]="form.steps" class="input-field" placeholder="10000">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sleep (hrs)</label>
              <input type="number" [(ngModel)]="form.sleepHours" step="0.5" class="input-field" placeholder="8">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
              <input type="number" [(ngModel)]="form.heartRate" class="input-field" placeholder="72">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" [(ngModel)]="form.weight" step="0.1" class="input-field" placeholder="70">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mood</label>
              <select [(ngModel)]="form.mood" class="input-field">
                <option value="great">😄 Great</option>
                <option value="good">🙂 Good</option>
                <option value="okay">😐 Okay</option>
                <option value="bad">😕 Bad</option>
                <option value="terrible">😞 Terrible</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input type="text" [(ngModel)]="form.notes" class="input-field" placeholder="How are you feeling?">
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <button (click)="saveLog()" class="btn-primary text-sm">Save Log</button>
            <button (click)="showForm.set(false)" class="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      }

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        @for (m of metrics; track m.label) {
          <div class="card text-center p-3 sm:p-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3" [class]="m.bg">
              <i [class]="m.icon + ' ' + m.color + ' text-sm sm:text-base'"></i>
            </div>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ m.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ m.label }}</p>
            <div class="progress-bar mt-2">
              <div class="progress-fill" [class]="m.fill" [style.width.%]="m.pct"></div>
            </div>
          </div>
        }
      </div>

      <!-- Logs Table -->
      <div class="card">
        <h3 class="font-bold text-gray-900 mb-4">Health Log History</h3>
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <div class="min-w-[500px] px-4 sm:px-0">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Calories</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Water</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Steps</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Sleep</th>
                <th class="text-left py-3 px-2 text-gray-500 font-medium">Mood</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-2 font-medium text-gray-800">{{ log.date | date:'MMM d, y' }}</td>
                  <td class="py-3 px-2 text-gray-600">{{ log.calories }} kcal</td>
                  <td class="py-3 px-2 text-gray-600">{{ log.water }} ml</td>
                  <td class="py-3 px-2 text-gray-600">{{ log.steps | number }}</td>
                  <td class="py-3 px-2 text-gray-600">{{ log.sleepHours | number:'1.1-1' }}h</td>
                  <td class="py-3 px-2"><span class="badge" [class]="moodClass(log.mood)">{{ log.mood }}</span></td>
                </tr>
              }
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HealthTrackingComponent implements OnInit {
  showForm = signal(false);
  loading = signal(true);
  logs = signal<HealthLog[]>([]);
  form = { calories: 0, water: 0, steps: 0, sleepHours: 0, heartRate: 0, weight: 0, mood: 'good' as const, notes: '' };

  constructor(private health: HealthService, private auth: AuthService) {}

  ngOnInit() {
    this.health.getLogs().subscribe({
      next: (logs: HealthLog[]) => { this.logs.set(logs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  metrics = [
    { label: 'Avg Calories', value: '1,920', icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600', fill: 'bg-orange-500', pct: 76 },
    { label: 'Avg Water', value: '2.2L', icon: 'fas fa-tint', bg: 'bg-cyan-100', color: 'text-cyan-600', fill: 'bg-cyan-500', pct: 88 },
    { label: 'Avg Steps', value: '9,241', icon: 'fas fa-walking', bg: 'bg-blue-100', color: 'text-blue-600', fill: 'bg-blue-500', pct: 92 },
    { label: 'Avg Sleep', value: '7.4h', icon: 'fas fa-moon', bg: 'bg-purple-100', color: 'text-purple-600', fill: 'bg-purple-500', pct: 93 },
  ];

  saveLog() {
    const user = this.auth.currentUser();
    if (!user) return;
    const logData: Partial<HealthLog> = {
      userId: user.id, date: new Date(),
      calories: this.form.calories, water: this.form.water, steps: this.form.steps,
      sleepHours: this.form.sleepHours, heartRate: this.form.heartRate,
      weight: this.form.weight, mood: this.form.mood, notes: this.form.notes
    };
    this.health.addLog(logData).subscribe({
      next: (log: HealthLog) => {
        this.logs.update(l => [log, ...l]);
        this.showForm.set(false);
        this.form = { calories: 0, water: 0, steps: 0, sleepHours: 0, heartRate: 0, weight: 0, mood: 'good', notes: '' };
      }
    });
  }

  moodClass(mood: string) {
    const map: Record<string, string> = { great: 'badge-green', good: 'badge-blue', okay: 'badge-orange', bad: 'badge-red', terrible: 'badge-red' };
    return map[mood] || 'badge-blue';
  }
}
