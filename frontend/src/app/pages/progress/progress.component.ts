import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <p class="text-gray-500 mt-1">Visualize your health journey over time</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (s of summary; track s.label) {
          <div class="card text-center">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" [class]="s.bg">
              <i [class]="s.icon + ' ' + s.color"></i>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ s.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
            <p class="text-xs mt-1" [class]="s.trend > 0 ? 'text-green-500' : 'text-red-500'">
              <i class="fas" [class]="s.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
              {{ s.trend > 0 ? '+' : '' }}{{ s.trend }}% this week
            </p>
          </div>
        }
      </div>

      <!-- Weekly Chart (visual bars) -->
      <div class="card mb-6">
        <h3 class="font-bold text-gray-900 mb-4">Weekly Steps</h3>
        <div class="flex items-end gap-3 h-40">
          @for (d of weeklySteps; track d.day) {
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-gray-500">{{ d.steps | number }}</span>
              <div class="w-full rounded-t-lg bg-primary-500 transition-all duration-500"
                [style.height.%]="(d.steps / 12000) * 100"
                [style.min-height.px]="4"></div>
              <span class="text-xs text-gray-400">{{ d.day }}</span>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Weight Progress -->
        <div class="card">
          <h3 class="font-bold text-gray-900 mb-4">Weight Trend (kg)</h3>
          <div class="flex items-end gap-2 h-32">
            @for (w of weightData; track w.date) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-xs text-gray-500">{{ w.weight }}</span>
                <div class="w-full rounded-t-lg bg-green-400"
                  [style.height.%]="((w.weight - 68) / 6) * 100"
                  [style.min-height.px]="4"></div>
                <span class="text-xs text-gray-400">{{ w.date }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Achievements -->
        <div class="card">
          <h3 class="font-bold text-gray-900 mb-4">Achievements</h3>
          <div class="space-y-3">
            @for (a of achievements; track a.title) {
              <div class="flex items-center gap-3 p-3 rounded-xl" [class]="a.earned ? 'bg-yellow-50' : 'bg-gray-50'">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" [class]="a.earned ? 'bg-yellow-100' : 'bg-gray-200'">
                  <i [class]="a.icon + (a.earned ? ' text-yellow-500' : ' text-gray-400')"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold" [class]="a.earned ? 'text-gray-900' : 'text-gray-400'">{{ a.title }}</p>
                  <p class="text-xs text-gray-400">{{ a.desc }}</p>
                </div>
                @if (a.earned) { <i class="fas fa-check-circle text-yellow-500"></i> }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProgressComponent {

  summary = [
    { label: 'Workouts Done', value: '12', icon: 'fas fa-dumbbell', bg: 'bg-purple-100', color: 'text-purple-600', trend: 20 },
    { label: 'Avg Steps/Day', value: '9,241', icon: 'fas fa-walking', bg: 'bg-blue-100', color: 'text-blue-600', trend: 8 },
    { label: 'Weight Lost', value: '2.3kg', icon: 'fas fa-weight', bg: 'bg-green-100', color: 'text-green-600', trend: 5 },
    { label: 'Streak Days', value: '14', icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600', trend: 40 },
  ];

  weeklySteps = [
    { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 10500 }, { day: 'Wed', steps: 7800 },
    { day: 'Thu', steps: 11200 }, { day: 'Fri', steps: 9400 }, { day: 'Sat', steps: 6500 }, { day: 'Sun', steps: 8900 }
  ];

  weightData = [
    { date: 'W1', weight: 74.2 }, { date: 'W2', weight: 73.8 }, { date: 'W3', weight: 73.1 },
    { date: 'W4', weight: 72.5 }, { date: 'W5', weight: 72.0 }, { date: 'W6', weight: 71.9 }
  ];

  achievements = [
    { title: '7-Day Streak', desc: 'Logged health data 7 days in a row', icon: 'fas fa-fire', earned: true },
    { title: 'Step Master', desc: 'Reached 10,000 steps in a day', icon: 'fas fa-walking', earned: true },
    { title: 'Hydration Hero', desc: 'Met water goal 5 days straight', icon: 'fas fa-tint', earned: true },
    { title: 'Marathon Ready', desc: 'Complete 30 workout sessions', icon: 'fas fa-medal', earned: false },
  ];
}
