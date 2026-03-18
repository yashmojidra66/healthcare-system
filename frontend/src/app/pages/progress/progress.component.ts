import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';
import { HealthLog } from '../../models/health.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <p class="text-gray-500 mt-1">Your real health journey over time</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-24">
          <i class="fas fa-spinner fa-spin text-primary-500 text-3xl"></i>
        </div>
      }

      @if (!loading()) {
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          @for (s of summary(); track s.label) {
            <div class="card text-center">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" [class]="s.bg">
                <i [class]="s.icon + ' ' + s.color"></i>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ s.value }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
            </div>
          }
        </div>

        @if (logs().length === 0) {
          <div class="card text-center py-16">
            <i class="fas fa-chart-line text-5xl text-gray-300 mb-4 block"></i>
            <p class="text-gray-500 font-medium text-lg">No health logs yet</p>
            <p class="text-gray-400 text-sm mt-1">Start logging your daily health data to see your progress here</p>
          </div>
        }

        @if (logs().length > 0) {
          <!-- Steps Chart -->
          <div class="card mb-6">
            <h3 class="font-bold text-gray-900 mb-4">Daily Steps (last 7 logs)</h3>
            <div class="flex items-end gap-3 h-40">
              @for (d of last7(); track d.date) {
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-xs text-gray-500">{{ d.steps | number }}</span>
                  <div class="w-full rounded-t-lg bg-primary-500 transition-all duration-500"
                    [style.height.%]="stepsBarHeight(d.steps)"
                    style="min-height:4px"></div>
                  <span class="text-xs text-gray-400">{{ d.date | date:'EEE' }}</span>
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Calories Chart -->
            <div class="card">
              <h3 class="font-bold text-gray-900 mb-4">Calories Intake (last 7 logs)</h3>
              <div class="flex items-end gap-2 h-32">
                @for (d of last7(); track d.date) {
                  <div class="flex-1 flex flex-col items-center gap-1">
                    <span class="text-xs text-gray-500">{{ d.calories }}</span>
                    <div class="w-full rounded-t-lg bg-orange-400"
                      [style.height.%]="caloriesBarHeight(d.calories)"
                      style="min-height:4px"></div>
                    <span class="text-xs text-gray-400">{{ d.date | date:'EEE' }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Sleep Chart -->
            <div class="card">
              <h3 class="font-bold text-gray-900 mb-4">Sleep Hours (last 7 logs)</h3>
              <div class="flex items-end gap-2 h-32">
                @for (d of last7(); track d.date) {
                  <div class="flex-1 flex flex-col items-center gap-1">
                    <span class="text-xs text-gray-500">{{ d.sleep }}h</span>
                    <div class="w-full rounded-t-lg bg-indigo-400"
                      [style.height.%]="sleepBarHeight(d.sleep)"
                      style="min-height:4px"></div>
                    <span class="text-xs text-gray-400">{{ d.date | date:'EEE' }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Log Table -->
          <div class="card mt-6">
            <h3 class="font-bold text-gray-900 mb-4">All Health Logs</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                    <th class="text-right py-2 px-3 text-gray-500 font-medium">Calories</th>
                    <th class="text-right py-2 px-3 text-gray-500 font-medium">Steps</th>
                    <th class="text-right py-2 px-3 text-gray-500 font-medium">Water (ml)</th>
                    <th class="text-right py-2 px-3 text-gray-500 font-medium">Sleep (h)</th>
                    <th class="text-center py-2 px-3 text-gray-500 font-medium">Mood</th>
                  </tr>
                </thead>
                <tbody>
                  @for (log of logs(); track log.id) {
                    <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td class="py-2 px-3 text-gray-700">{{ log.date | date:'MMM d, y' }}</td>
                      <td class="py-2 px-3 text-right text-orange-600 font-medium">{{ log.calories }}</td>
                      <td class="py-2 px-3 text-right text-blue-600 font-medium">{{ log.steps | number }}</td>
                      <td class="py-2 px-3 text-right text-cyan-600 font-medium">{{ log.water }}</td>
                      <td class="py-2 px-3 text-right text-indigo-600 font-medium">{{ log.sleepHours }}</td>
                      <td class="py-2 px-3 text-center">{{ moodEmoji(log.mood) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class ProgressComponent implements OnInit {
  logs = signal<HealthLog[]>([]);
  loading = signal(true);

  constructor(private health: HealthService) {}

  ngOnInit() {
    this.health.getLogs().subscribe({
      next: data => { this.logs.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  last7() {
    return this.logs().slice(0, 7).map(l => ({
      date: new Date(l.date),
      steps: l.steps || 0,
      calories: l.calories || 0,
      sleep: l.sleepHours || 0,
    }));
  }

  summary() {
    const all = this.logs();
    if (!all.length) return [
      { label: 'Total Logs', value: '0', icon: 'fas fa-clipboard-list', bg: 'bg-blue-100', color: 'text-blue-600' },
      { label: 'Avg Steps', value: '—', icon: 'fas fa-walking', bg: 'bg-green-100', color: 'text-green-600' },
      { label: 'Avg Sleep', value: '—', icon: 'fas fa-moon', bg: 'bg-indigo-100', color: 'text-indigo-600' },
      { label: 'Avg Calories', value: '—', icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600' },
    ];
    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    return [
      { label: 'Total Logs', value: String(all.length), icon: 'fas fa-clipboard-list', bg: 'bg-blue-100', color: 'text-blue-600' },
      { label: 'Avg Steps/Day', value: avg(all.map(l => l.steps || 0)).toLocaleString(), icon: 'fas fa-walking', bg: 'bg-green-100', color: 'text-green-600' },
      { label: 'Avg Sleep (h)', value: (all.reduce((a, l) => a + (l.sleepHours || 0), 0) / all.length).toFixed(1), icon: 'fas fa-moon', bg: 'bg-indigo-100', color: 'text-indigo-600' },
      { label: 'Avg Calories', value: avg(all.map(l => l.calories || 0)).toLocaleString(), icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600' },
    ];
  }

  maxSteps() { return Math.max(...this.last7().map(d => d.steps), 1); }
  maxCalories() { return Math.max(...this.last7().map(d => d.calories), 1); }
  maxSleep() { return Math.max(...this.last7().map(d => d.sleep), 1); }

  stepsBarHeight(v: number) { return Math.max((v / this.maxSteps()) * 100, 2); }
  caloriesBarHeight(v: number) { return Math.max((v / this.maxCalories()) * 100, 2); }
  sleepBarHeight(v: number) { return Math.max((v / this.maxSleep()) * 100, 2); }

  moodEmoji(mood: string): string {
    const m: Record<string, string> = { great: '😄', good: '🙂', okay: '😐', bad: '😕', terrible: '😞' };
    return m[mood] ?? '—';
  }
}
