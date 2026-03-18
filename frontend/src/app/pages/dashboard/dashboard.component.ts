import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';
import { HealthLog, Appointment } from '../../models/health.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Good {{ greeting }}, {{ (auth.currentUser()?.name || 'there').split(' ')[0] }} 👋</h1>
          <p class="text-gray-500 mt-1 text-sm sm:text-base">Here's your health overview for today</p>
        </div>
        <a routerLink="/health-tracking" class="btn-primary self-start text-sm sm:text-base">
          <i class="fas fa-plus mr-2"></i>Log Today
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        @for (stat of stats; track stat.label) {
          <div class="card flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" [class]="stat.bg">
              <i [class]="stat.icon + ' ' + stat.color + ' text-sm sm:text-base'"></i>
            </div>
            <div class="min-w-0">
              <p class="text-lg sm:text-2xl font-bold text-gray-900 truncate">{{ stat.value }}</p>
              <p class="text-xs text-gray-500 truncate">{{ stat.label }}</p>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Logs -->
        <div class="lg:col-span-2 card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Recent Health Logs</h3>
            <a routerLink="/health-tracking" class="text-sm text-primary-600 hover:underline">View all</a>
          </div>
          <div class="space-y-3">
            @if (loadingLogs()) {
              <div class="text-center py-6 text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</div>
            } @else {
              @for (log of recentLogs(); track log.id) {
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <i class="fas fa-calendar-day text-primary-600 text-sm"></i>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-800">{{ log.date | date:'MMM d' }}</p>
                      <p class="text-xs text-gray-500">{{ log.calories }} kcal · {{ log.steps | number }} steps</p>
                    </div>
                  </div>
                  <span class="badge" [class]="moodClass(log.mood)">{{ log.mood }}</span>
                </div>
              }
              @if (recentLogs().length === 0) {
                <p class="text-sm text-gray-400 text-center py-4">No health logs yet</p>
              }
            }
          </div>
        </div>

        <!-- Quick Links -->
        <div class="card">
          <h3 class="font-bold text-gray-900 mb-4">Quick Access</h3>
          <div class="space-y-2">
            @for (link of quickLinks; track link.label) {
              <a [routerLink]="link.path" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" [class]="link.bg">
                  <i [class]="link.icon + ' ' + link.color + ' text-sm'"></i>
                </div>
                <span class="text-sm font-medium text-gray-700 group-hover:text-primary-600">{{ link.label }}</span>
                <i class="fas fa-chevron-right text-xs text-gray-300 ml-auto group-hover:text-primary-400"></i>
              </a>
            }
          </div>
        </div>

        <!-- Upcoming Appointments -->
        <div class="lg:col-span-2 card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Upcoming Appointments</h3>
            <a routerLink="/appointments" class="text-sm text-primary-600 hover:underline">View all</a>
          </div>
          <div class="space-y-3">
            @if (loadingAppts()) {
              <div class="text-center py-6 text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</div>
            } @else {
              @for (appt of upcomingAppts(); track appt.id) {
                <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                    <i class="fas fa-user-md text-gray-400 text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">{{ appt.doctorName }}</p>
                    <p class="text-xs text-gray-500">{{ appt.specialty }} · {{ appt.date | date:'MMM d' }} at {{ appt.time }}</p>
                  </div>
                  <span class="badge" [class]="apptClass(appt.status)">{{ appt.status }}</span>
                </div>
              }
              @if (upcomingAppts().length === 0) {
                <p class="text-sm text-gray-400 text-center py-4">No upcoming appointments</p>
              }
            }
          </div>
        </div>

        <!-- Right column: Goals + Active Plans -->
        <div class="space-y-6">
          <!-- Today's Goals -->
          <div class="card">
            <h3 class="font-bold text-gray-900 mb-4">Today's Goals</h3>
            <div class="space-y-4">
              @for (goal of goals; track goal.label) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ goal.label }}</span>
                    <span class="font-semibold text-gray-800">{{ goal.current }}/{{ goal.target }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [class]="goal.color" [style.width.%]="(goal.current/goal.target)*100 | number:'1.0-0'"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Active Meal Plan -->
          @if (activeMealPlan()) {
            <div class="card border-l-4 border-orange-400">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-900 text-sm">Active Meal Plan</h3>
                <span class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">Day {{ mealPlanDay() }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-utensils text-orange-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 text-sm truncate">{{ activeMealPlan().name }}</p>
                  <p class="text-xs text-gray-500">{{ activeMealPlan().calories }} kcal · {{ activeMealPlan().protein }}g protein</p>
                </div>
              </div>
              <a routerLink="/meal-plans" class="mt-3 block text-center text-xs text-orange-600 hover:text-orange-700 font-medium">
                Track meals <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          }

          <!-- Active Workout Plan -->
          @if (activeWorkoutPlan()) {
            <div class="card border-l-4 border-purple-400">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-900 text-sm">Active Workout Plan</h3>
                <span class="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">Day {{ workoutPlanDay() }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-dumbbell text-purple-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 text-sm truncate">{{ activeWorkoutPlan().name }}</p>
                  <p class="text-xs text-gray-500">{{ activeWorkoutPlan().category }} · {{ activeWorkoutPlan().duration }} min/session</p>
                </div>
              </div>
              <a routerLink="/workouts" class="mt-3 block text-center text-xs text-purple-600 hover:text-purple-700 font-medium">
                Log session <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  recentLogs = signal<HealthLog[]>([]);
  upcomingAppts = signal<Appointment[]>([]);
  loadingLogs = signal(true);
  loadingAppts = signal(true);
  activeMealPlan = signal<any>(null);
  activeWorkoutPlan = signal<any>(null);
  mealPlanDay = signal(1);
  workoutPlanDay = signal(1);

  constructor(public auth: AuthService, private health: HealthService) {}

  ngOnInit() {
    this.health.getLogs().subscribe({
      next: (logs: HealthLog[]) => { this.recentLogs.set(logs.slice(0, 4)); this.loadingLogs.set(false); },
      error: () => this.loadingLogs.set(false)
    });
    this.health.getAppointments().subscribe({
      next: (appts: Appointment[]) => {
        this.upcomingAppts.set(appts.filter((a: Appointment) => a.status !== 'completed' && a.status !== 'cancelled').slice(0, 3));
        this.loadingAppts.set(false);
      },
      error: () => this.loadingAppts.set(false)
    });

    // Load active plans from localStorage
    const mealPlan = localStorage.getItem('activeMealPlan');
    if (mealPlan) this.activeMealPlan.set(JSON.parse(mealPlan));
    const mealStart = localStorage.getItem('mealPlanStartDate');
    if (mealStart) this.mealPlanDay.set(Math.floor((Date.now() - new Date(mealStart).getTime()) / 86400000) + 1);

    const workoutPlan = localStorage.getItem('activeWorkoutPlan');
    if (workoutPlan) this.activeWorkoutPlan.set(JSON.parse(workoutPlan));
    const workoutStart = localStorage.getItem('workoutPlanStartDate');
    if (workoutStart) this.workoutPlanDay.set(Math.floor((Date.now() - new Date(workoutStart).getTime()) / 86400000) + 1);
  }

  get greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  }

  stats = [
    { label: 'Steps Today', value: '8,432', icon: 'fas fa-walking', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Calories', value: '1,840', icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600' },
    { label: 'Water (ml)', value: '2,100', icon: 'fas fa-tint', bg: 'bg-cyan-100', color: 'text-cyan-600' },
    { label: 'Sleep (hrs)', value: '7.5', icon: 'fas fa-moon', bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  goals = [
    { label: 'Steps', current: 8432, target: 10000, color: 'bg-blue-500' },
    { label: 'Water', current: 2100, target: 2500, color: 'bg-cyan-500' },
    { label: 'Calories', current: 1840, target: 2000, color: 'bg-orange-500' },
    { label: 'Sleep', current: 7.5, target: 8, color: 'bg-purple-500' },
  ];

  quickLinks = [
    { label: 'Health Tracking', path: '/health-tracking', icon: 'fas fa-chart-line', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Meal Plans', path: '/meal-plans', icon: 'fas fa-utensils', bg: 'bg-orange-100', color: 'text-orange-600' },
    { label: 'Workouts', path: '/workouts', icon: 'fas fa-dumbbell', bg: 'bg-purple-100', color: 'text-purple-600' },
    { label: 'Appointments', path: '/appointments', icon: 'fas fa-calendar', bg: 'bg-green-100', color: 'text-green-600' },
  ];

  moodClass(mood: string) {
    const map: Record<string, string> = { great: 'badge-green', good: 'badge-blue', okay: 'badge-orange', bad: 'badge-red', terrible: 'badge-red' };
    return map[mood] || 'badge-blue';
  }

  apptClass(status: string) {
    const map: Record<string, string> = { confirmed: 'badge-green', pending: 'badge-orange', completed: 'badge-blue', cancelled: 'badge-red' };
    return map[status] || 'badge-blue';
  }
}
