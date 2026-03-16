import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';
import { MealPlan } from '../../models/health.model';

@Component({
  selector: 'app-meal-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Meal Plans</h1>
        <p class="text-gray-500 mt-1">Personalized nutrition plans to fuel your goals</p>
      </div>

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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (plan of filteredPlans(); track plan.id) {
          <div class="card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-200">
            <img [src]="plan.imageUrl" [alt]="plan.name" class="w-full h-48 object-cover">
            <div class="p-5">
              <div class="flex flex-wrap gap-1 mb-3">
                @for (tag of plan.tags.slice(0,2); track tag) {
                  <span class="badge badge-blue">{{ tag }}</span>
                }
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-1">{{ plan.name }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ plan.description }}</p>
              <div class="grid grid-cols-4 gap-2 mb-4">
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
              <button (click)="selected.set(plan)" class="btn-primary w-full text-sm py-2">View Plan</button>
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (selected()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selected.set(null)">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 animate-slide-up" (click)="$event.stopPropagation()">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">{{ selected()!.name }}</h2>
              <button (click)="selected.set(null)" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <img [src]="selected()!.imageUrl" class="w-full h-40 object-cover rounded-xl mb-4">
            <p class="text-gray-600 text-sm mb-4">{{ selected()!.description }}</p>
            <div class="grid grid-cols-4 gap-3 mb-4">
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
            <button class="btn-primary w-full">Start This Plan</button>
          </div>
        </div>
      }
    </div>
  `
})
export class MealPlansComponent implements OnInit {
  plans = signal<MealPlan[]>([]);
  activeTag = signal('All');
  selected = signal<MealPlan | null>(null);
  tags = ['All', 'heart-healthy', 'high-protein', 'weight-loss', 'vegan'];

  constructor(private health: HealthService) {}

  ngOnInit() {
    this.health.getMealPlans().subscribe((plans: MealPlan[]) => this.plans.set(plans));
  }

  filteredPlans() {
    if (this.activeTag() === 'All') return this.plans();
    return this.plans().filter(p => p.tags.includes(this.activeTag()));
  }
}
