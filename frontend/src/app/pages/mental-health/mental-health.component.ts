import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mental-health',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mental Health</h1>
        <p class="text-gray-500 mt-1">Track your emotional wellbeing and build resilience</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Mood Check-in -->
        <div class="lg:col-span-2 card">
          <h3 class="font-bold text-gray-900 mb-4">Daily Check-in</h3>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Overall Mood ({{ form.mood }}/10)</label>
              <input type="range" min="1" max="10" [(ngModel)]="form.mood" class="w-full accent-primary-600">
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>😞 Terrible</span><span>😐 Okay</span><span>😄 Amazing</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Anxiety Level ({{ form.anxiety }}/10)</label>
              <input type="range" min="1" max="10" [(ngModel)]="form.anxiety" class="w-full accent-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stress Level ({{ form.stress }}/10)</label>
              <input type="range" min="1" max="10" [(ngModel)]="form.stress" class="w-full accent-red-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Journal Entry</label>
              <textarea [(ngModel)]="form.journal" rows="4" placeholder="How are you feeling today? What's on your mind?"
                class="input-field resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Activities Today</label>
              <div class="flex flex-wrap gap-2">
                @for (act of activities; track act) {
                  <button (click)="toggleActivity(act)"
                    class="px-3 py-1.5 rounded-full text-sm transition-all"
                    [class]="form.selectedActivities.includes(act) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                    {{ act }}
                  </button>
                }
              </div>
            </div>
            <button (click)="saveEntry()" class="btn-primary w-full">Save Check-in</button>
            @if (saved()) {
              <div class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm text-center animate-fade-in">
                <i class="fas fa-check-circle mr-2"></i>Check-in saved successfully!
              </div>
            }
          </div>
        </div>

        <!-- Resources -->
        <div class="space-y-4">
          <div class="card">
            <h3 class="font-bold text-gray-900 mb-4">Wellness Resources</h3>
            <div class="space-y-3">
              @for (r of resources; track r.title) {
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" [class]="r.bg">
                    <i [class]="r.icon + ' ' + r.color + ' text-sm'"></i>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ r.title }}</p>
                    <p class="text-xs text-gray-500">{{ r.desc }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <h3 class="font-bold mb-2">Breathing Exercise</h3>
            <p class="text-sm text-purple-100 mb-4">4-7-8 technique to reduce anxiety instantly</p>
            <button (click)="breathingActive.set(!breathingActive())" class="bg-white text-purple-600 font-semibold py-2 px-4 rounded-xl text-sm hover:bg-purple-50 transition-colors">
              {{ breathingActive() ? 'Stop' : 'Start Exercise' }}
            </button>
            @if (breathingActive()) {
              <div class="mt-4 text-center">
                <div class="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center mx-auto animate-pulse-slow">
                  <span class="text-sm font-bold">Breathe</span>
                </div>
                <p class="text-xs text-purple-100 mt-2">Inhale 4s · Hold 7s · Exhale 8s</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- History -->
      <div class="card mt-6">
        <h3 class="font-bold text-gray-900 mb-4">Mood History</h3>
        <div class="grid grid-cols-7 gap-2">
          @for (entry of moodHistory; track entry.day) {
            <div class="text-center">
              <div class="w-full aspect-square rounded-xl flex items-center justify-center text-white text-sm font-bold mb-1"
                [style.background]="moodColor(entry.mood)">
                {{ entry.mood }}
              </div>
              <p class="text-xs text-gray-400">{{ entry.day }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class MentalHealthComponent {
  form = { mood: 7, anxiety: 3, stress: 4, journal: '', selectedActivities: [] as string[] };
  saved = signal(false);
  breathingActive = signal(false);

  activities = ['Exercise', 'Meditation', 'Reading', 'Socializing', 'Nature Walk', 'Journaling', 'Music', 'Cooking'];

  resources = [
    { title: 'Guided Meditation', desc: '10-min sessions', icon: 'fas fa-spa', bg: 'bg-purple-100', color: 'text-purple-600' },
    { title: 'Stress Management', desc: 'Techniques & tips', icon: 'fas fa-brain', bg: 'bg-blue-100', color: 'text-blue-600' },
    { title: 'Sleep Hygiene', desc: 'Better sleep habits', icon: 'fas fa-moon', bg: 'bg-indigo-100', color: 'text-indigo-600' },
    { title: 'Crisis Support', desc: '24/7 helpline', icon: 'fas fa-phone', bg: 'bg-red-100', color: 'text-red-600' },
  ];

  moodHistory = [
    { day: 'Mon', mood: 8 }, { day: 'Tue', mood: 6 }, { day: 'Wed', mood: 7 },
    { day: 'Thu', mood: 5 }, { day: 'Fri', mood: 9 }, { day: 'Sat', mood: 8 }, { day: 'Sun', mood: 7 }
  ];

  toggleActivity(act: string) {
    const idx = this.form.selectedActivities.indexOf(act);
    if (idx > -1) this.form.selectedActivities.splice(idx, 1);
    else this.form.selectedActivities.push(act);
  }

  saveEntry() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  moodColor(mood: number): string {
    if (mood >= 8) return '#10b981';
    if (mood >= 6) return '#3b82f6';
    if (mood >= 4) return '#f59e0b';
    return '#ef4444';
  }
}
