import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';
import { MealPlan } from '../../models/health.model';

@Component({
  selector: 'app-meal-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-5 md:mb-6 gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Meal Plans</h1>
          <p class="text-gray-500 mt-1 text-sm sm:text-base">Personalized nutrition plans to fuel your goals</p>
        </div>
        @if (activePlan()) {
          <div class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
            <div class="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <i class="fas fa-check text-white text-sm"></i>
            </div>
            <div>
              <p class="text-xs text-green-600 font-semibold">Active Plan</p>
              <p class="text-sm font-bold text-green-800">{{ activePlan()!.name }}</p>
            </div>
            <button (click)="stopPlan()" class="ml-2 text-xs text-red-500 hover:text-red-700 font-medium">Stop</button>
          </div>
        }
      </div>

      <!-- Active Plan Daily Tracker -->
      @if (activePlan()) {
        <div class="card mb-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Today's Nutrition Target</h3>
            <span class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Day {{ currentDay() }}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <div class="text-center p-3 bg-orange-50 rounded-xl">
              <p class="text-lg font-bold text-orange-600">{{ activePlan()!.calories }}</p>
              <p class="text-xs text-gray-500">kcal target</p>
              <div class="mt-2 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                <div class="h-full bg-orange-400 rounded-full transition-all" [style.width.%]="calorieProgress()"></div>
              </div>
              <p class="text-xs text-orange-500 mt-1">{{ consumed().calories }} eaten</p>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-xl">
              <p class="text-lg font-bold text-blue-600">{{ activePlan()!.protein }}g</p>
              <p class="text-xs text-gray-500">protein</p>
              <div class="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-400 rounded-full transition-all" [style.width.%]="proteinProgress()"></div>
              </div>
              <p class="text-xs text-blue-500 mt-1">{{ consumed().protein }}g eaten</p>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-xl">
              <p class="text-lg font-bold text-yellow-600">{{ activePlan()!.carbs }}g</p>
              <p class="text-xs text-gray-500">carbs</p>
              <div class="mt-2 h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400 rounded-full transition-all" [style.width.%]="carbsProgress()"></div>
              </div>
              <p class="text-xs text-yellow-500 mt-1">{{ consumed().carbs }}g eaten</p>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-xl">
              <p class="text-lg font-bold text-red-600">{{ activePlan()!.fat }}g</p>
              <p class="text-xs text-gray-500">fat</p>
              <div class="mt-2 h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div class="h-full bg-red-400 rounded-full transition-all" [style.width.%]="fatProgress()"></div>
              </div>
              <p class="text-xs text-red-500 mt-1">{{ consumed().fat }}g eaten</p>
            </div>
          </div>

          <!-- Quick log meal -->
          <div class="border-t border-gray-100 pt-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">Log a Meal</p>
            <div class="flex gap-2 flex-wrap">
              @for (meal of quickMeals; track meal.name) {
                <button (click)="logMeal(meal)"
                  class="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl text-sm transition-all">
                  <span>{{ meal.emoji }}</span>
                  <span class="font-medium text-gray-700">{{ meal.name }}</span>
                  <span class="text-xs text-gray-400">{{ meal.calories }} kcal</span>
                </button>
              }
              <button (click)="showLogForm.set(!showLogForm())"
                class="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm text-primary-600 font-medium transition-all hover:bg-primary-100">
                <i class="fas fa-plus text-xs"></i> Custom
              </button>
            </div>
            @if (showLogForm()) {
              <div class="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input [(ngModel)]="logForm.name" placeholder="Meal name" class="input-field text-sm col-span-2 md:col-span-1">
                <input type="number" [(ngModel)]="logForm.calories" placeholder="kcal" class="input-field text-sm">
                <input type="number" [(ngModel)]="logForm.protein" placeholder="protein g" class="input-field text-sm">
                <input type="number" [(ngModel)]="logForm.carbs" placeholder="carbs g" class="input-field text-sm">
                <button (click)="logCustomMeal()" class="btn-primary text-sm py-2">Add</button>
              </div>
            }
          </div>

          <!-- Meal log today -->
          @if (todayLog().length > 0) {
            <div class="border-t border-gray-100 pt-4 mt-3">
              <p class="text-sm font-semibold text-gray-700 mb-2">Logged Today</p>
              <div class="space-y-1.5">
                @for (entry of todayLog(); track $index) {
                  <div class="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <span class="text-gray-700">{{ entry.name }}</span>
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                      <span class="text-orange-500 font-medium">{{ entry.calories }} kcal</span>
                      <span>P: {{ entry.protein }}g</span>
                      <span>C: {{ entry.carbs }}g</span>
                      <button (click)="removeMealLog($index)" class="text-red-400 hover:text-red-600 ml-1">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Filter tabs -->
      <div class="flex gap-2 mb-6 flex-wrap">
        @for (tag of tags; track tag) {
          <button (click)="activeTag.set(tag)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            [class]="activeTag() === tag ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'">
            {{ tag }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (plan of filteredPlans(); track plan._id || plan.id) {
          <div class="card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-200"
            [class.ring-2]="isActive(plan)" [class.ring-green-400]="isActive(plan)">
            <div class="relative">
              <img [src]="plan.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'"
                [alt]="plan.name" class="w-full h-48 object-cover">
              @if (isActive(plan)) {
                <div class="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <i class="fas fa-check mr-1"></i>Active
                </div>
              }
            </div>
            <div class="p-5">
              <div class="flex flex-wrap gap-1 mb-3">
                @for (tag of plan.tags.slice(0,2); track tag) {
                  <span class="badge badge-blue">{{ tag }}</span>
                }
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-1">{{ plan.name }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ plan.description }}</p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div class="text-center p-2 bg-orange-50 rounded-xl">
                  <p class="text-sm font-bold text-orange-600">{{ plan.calories }}</p>
                  <p class="text-xs text-gray-500">kcal</p>
                </div>
                <div class="text-center p-2 bg-blue-50 rounded-xl">
                  <p class="text-sm font-bold text-blue-600">{{ plan.protein }}g</p>
                  <p class="text-xs text-gray-500">protein</p>
                </div>
                <div class="text-center p-2 bg-yellow-50 rounded-xl">
                  <p class="text-sm font-bold text-yellow-600">{{ plan.carbs }}g</p>
                  <p class="text-xs text-gray-500">carbs</p>
                </div>
                <div class="text-center p-2 bg-red-50 rounded-xl">
                  <p class="text-sm font-bold text-red-600">{{ plan.fat }}g</p>
                  <p class="text-xs text-gray-500">fat</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button (click)="selected.set(plan)" class="btn-secondary flex-1 text-sm py-2">Details</button>
                @if (isActive(plan)) {
                  <button (click)="stopPlan()" class="flex-1 text-sm py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                    Stop Plan
                  </button>
                } @else {
                  <button (click)="startPlan(plan)" class="btn-primary flex-1 text-sm py-2">
                    <i class="fas fa-play mr-1"></i>Start Plan
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Detail Modal -->
      @if (selected()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selected.set(null)">
          <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up" (click)="$event.stopPropagation()">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">{{ selected()!.name }}</h2>
              <button (click)="selected.set(null)" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <img [src]="selected()!.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'"
              class="w-full h-40 object-cover rounded-xl mb-4">
            <p class="text-gray-600 text-sm mb-4">{{ selected()!.description }}</p>
            <div class="grid grid-cols-4 gap-3 mb-5">
              <div class="text-center p-3 bg-orange-50 rounded-xl">
                <p class="font-bold text-orange-600">{{ selected()!.calories }}</p>
                <p class="text-xs text-gray-500">Calories</p>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-xl">
                <p class="font-bold text-blue-600">{{ selected()!.protein }}g</p>
                <p class="text-xs text-gray-500">Protein</p>
              </div>
              <div class="text-center p-3 bg-yellow-50 rounded-xl">
                <p class="font-bold text-yellow-600">{{ selected()!.carbs }}g</p>
                <p class="text-xs text-gray-500">Carbs</p>
              </div>
              <div class="text-center p-3 bg-red-50 rounded-xl">
                <p class="font-bold text-red-600">{{ selected()!.fat }}g</p>
                <p class="text-xs text-gray-500">Fat</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-5">
              @for (tag of selected()!.tags; track tag) {
                <span class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{{ tag }}</span>
              }
            </div>
            @if (isActive(selected()!)) {
              <button (click)="stopPlan(); selected.set(null)" class="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                Stop This Plan
              </button>
            } @else {
              <button (click)="startPlan(selected()!); selected.set(null)" class="btn-primary w-full py-3">
                <i class="fas fa-play mr-2"></i>Start This Plan
              </button>
            }
          </div>
        </div>
      }

      <!-- Toast -->
      @if (toast()) {
        <div class="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium">
          <i class="fas fa-check mr-2"></i>{{ toast() }}
        </div>
      }
    </div>
  `
})
export class MealPlansComponent implements OnInit {
  plans = signal<MealPlan[]>([]);
  loading = signal(true);
  activeTag = signal('All');
  selected = signal<MealPlan | null>(null);
  activePlan = signal<MealPlan | null>(null);
  showLogForm = signal(false);
  toast = signal('');
  currentDay = signal(1);

  tags = ['All', 'heart-healthy', 'high-protein', 'weight-loss', 'vegan', 'muscle-gain', 'plant-based', 'balanced'];

  logForm = { name: '', calories: 0, protein: 0, carbs: 0 };
  todayLog = signal<{ name: string; calories: number; protein: number; carbs: number; fat: number }[]>([]);

  quickMeals = [
    { emoji: '🥣', name: 'Oatmeal', calories: 300, protein: 10, carbs: 55, fat: 5 },
    { emoji: '🥗', name: 'Salad', calories: 200, protein: 8, carbs: 20, fat: 10 },
    { emoji: '🍗', name: 'Chicken', calories: 350, protein: 45, carbs: 5, fat: 12 },
    { emoji: '🍌', name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0 },
    { emoji: '🥚', name: 'Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10 },
    { emoji: '🥛', name: 'Protein Shake', calories: 180, protein: 25, carbs: 10, fat: 3 },
  ];

  constructor(private health: HealthService) {}

  ngOnInit() {
    this.health.getMealPlans().subscribe((plans: MealPlan[]) => {
      this.plans.set(plans);
      this.loading.set(false);
    });
    // Load active plan from localStorage
    const saved = localStorage.getItem('activeMealPlan');
    if (saved) this.activePlan.set(JSON.parse(saved));
    const savedLog = localStorage.getItem('mealLog_' + new Date().toDateString());
    if (savedLog) this.todayLog.set(JSON.parse(savedLog));
    const startDate = localStorage.getItem('mealPlanStartDate');
    if (startDate) {
      const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1;
      this.currentDay.set(days);
    }
  }

  filteredPlans() {
    if (this.activeTag() === 'All') return this.plans();
    return this.plans().filter(p => p.tags.includes(this.activeTag()));
  }

  isActive(plan: MealPlan) {
    const a = this.activePlan();
    return a && (a._id || a.id) === (plan._id || plan.id);
  }

  startPlan(plan: MealPlan) {
    this.activePlan.set(plan);
    localStorage.setItem('activeMealPlan', JSON.stringify(plan));
    localStorage.setItem('mealPlanStartDate', new Date().toISOString());
    this.currentDay.set(1);
    this.showToast('Plan started! Track your meals daily.');
  }

  stopPlan() {
    this.activePlan.set(null);
    localStorage.removeItem('activeMealPlan');
    localStorage.removeItem('mealPlanStartDate');
  }

  logMeal(meal: { name: string; calories: number; protein: number; carbs: number; fat: number }) {
    this.todayLog.update(l => [...l, meal]);
    this.saveTodayLog();
    this.showToast(meal.name + ' logged!');
  }

  logCustomMeal() {
    if (!this.logForm.name) return;
    this.todayLog.update(l => [...l, { ...this.logForm, fat: 0 }]);
    this.saveTodayLog();
    this.logForm = { name: '', calories: 0, protein: 0, carbs: 0 };
    this.showLogForm.set(false);
    this.showToast('Meal logged!');
  }

  removeMealLog(i: number) {
    this.todayLog.update(l => l.filter((_, idx) => idx !== i));
    this.saveTodayLog();
  }

  saveTodayLog() {
    localStorage.setItem('mealLog_' + new Date().toDateString(), JSON.stringify(this.todayLog()));
  }

  consumed() {
    return this.todayLog().reduce((acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  calorieProgress() { const p = this.activePlan(); return p ? Math.min((this.consumed().calories / p.calories) * 100, 100) : 0; }
  proteinProgress() { const p = this.activePlan(); return p ? Math.min((this.consumed().protein / p.protein) * 100, 100) : 0; }
  carbsProgress() { const p = this.activePlan(); return p ? Math.min((this.consumed().carbs / p.carbs) * 100, 100) : 0; }
  fatProgress() { const p = this.activePlan(); return p ? Math.min((this.consumed().fat / p.fat) * 100, 100) : 0; }

  showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(''), 2500);
  }
}
