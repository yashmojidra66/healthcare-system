import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: Date;
  notes: string;
}

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Workouts</h1>
          <p class="text-gray-500 mt-1">Track your fitness activities</p>
        </div>
        <button (click)="showForm.set(!showForm())" class="btn-primary">
          <i class="fas fa-plus mr-2"></i>Log Workout
        </button>
      </div>

      @if (showForm()) {
        <div class="card mb-8">
          <h3 class="font-bold text-gray-900 mb-4">Add Workout</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
              <input type="text" [(ngModel)]="form.name" class="input-field" placeholder="Morning Run">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select [(ngModel)]="form.type" class="input-field">
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" [(ngModel)]="form.duration" class="input-field" placeholder="30">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
              <input type="number" [(ngModel)]="form.calories" class="input-field" placeholder="300">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input type="text" [(ngModel)]="form.notes" class="input-field" placeholder="How did it go?">
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <button (click)="saveWorkout()" class="btn-primary">Save</button>
            <button (click)="showForm.set(false)" class="btn-secondary">Cancel</button>
          </div>
        </div>
      }

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (stat of stats; track stat.label) {
          <div class="card text-center">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" [class]="stat.bg">
              <i [class]="stat.icon + ' ' + stat.color"></i>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
          </div>
        }
      </div>

      <div class="card">
        <h3 class="font-bold text-gray-900 mb-4">Recent Workouts</h3>
        @if (workouts().length === 0) {
          <p class="text-gray-400 text-center py-8">No workouts logged yet. Start tracking!</p>
        }
        <div class="space-y-3">
          @for (w of workouts(); track w.id) {
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i [class]="typeIcon(w.type) + ' text-blue-600'"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ w.name }}</p>
                  <p class="text-sm text-gray-500">{{ w.date | date:'MMM d, y' }} · {{ w.type }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ w.duration }} min</p>
                <p class="text-sm text-gray-500">{{ w.calories }} kcal</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class WorkoutsComponent {
  showForm = signal(false);
  workouts = signal<Workout[]>([
    { id: '1', name: 'Morning Run', type: 'cardio', duration: 30, calories: 320, date: new Date(), notes: '' },
    { id: '2', name: 'Weight Training', type: 'strength', duration: 45, calories: 280, date: new Date(Date.now() - 86400000), notes: '' },
  ]);

  form = { name: '', type: 'cardio', duration: 0, calories: 0, notes: '' };

  stats = [
    { label: 'This Week', value: '4', icon: 'fas fa-dumbbell', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Total Minutes', value: '210', icon: 'fas fa-clock', bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Calories Burned', value: '1,840', icon: 'fas fa-fire', bg: 'bg-orange-100', color: 'text-orange-600' },
    { label: 'Streak', value: '5d', icon: 'fas fa-bolt', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  ];

  saveWorkout() {
    if (!this.form.name) return;
    this.workouts.update(list => [...list, { id: Date.now().toString(), ...this.form, date: new Date() }]);
    this.form = { name: '', type: 'cardio', duration: 0, calories: 0, notes: '' };
    this.showForm.set(false);
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      cardio: 'fas fa-running',
      strength: 'fas fa-dumbbell',
      flexibility: 'fas fa-child',
      sports: 'fas fa-futbol',
      other: 'fas fa-heartbeat'
    };
    return map[type] || 'fas fa-dumbbell';
  }
}
