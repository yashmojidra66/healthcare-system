import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p class="text-gray-500 mt-1 text-sm sm:text-base">Connect with certified healthcare professionals</p>
      </div>

      <!-- Search -->
      <div class="card mb-5 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" [(ngModel)]="search" placeholder="Search by name or specialty..."
            class="input-field pl-10">
        </div>
        <select [(ngModel)]="specialty" class="input-field sm:w-48">
          <option value="">All Specialties</option>
          @for (s of specialties; track s) { <option [value]="s">{{ s }}</option> }
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        @for (doc of filteredDoctors(); track doc.id) {
          <div class="card hover:scale-[1.02] transition-transform duration-200">
            <div class="flex items-start gap-4 mb-4">
              <img src="https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg"
                [alt]="doc.name" class="w-16 h-16 rounded-2xl object-cover shadow-md flex-shrink-0">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900">{{ doc.name }}</h3>
                <p class="text-sm text-primary-600 font-medium">{{ doc.specialty }}</p>
                <p class="text-xs text-gray-500">{{ doc.hospital }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 mb-3">
              @for (s of [1,2,3,4,5]; track s) {
                <i class="fas fa-star text-xs" [class]="s <= doc.rating ? 'text-yellow-400' : 'text-gray-200'"></i>
              }
              <span class="text-xs text-gray-500 ml-1">{{ doc.rating }} ({{ doc.reviewCount }})</span>
            </div>
            <div class="flex gap-3 text-xs text-gray-500 mb-4">
              <span><i class="fas fa-briefcase mr-1 text-primary-400"></i>{{ doc.experience }}y exp</span>
              <span><i class="fas fa-dollar-sign mr-1 text-green-500"></i>{{ doc.consultationFee }}/visit</span>
            </div>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ doc.bio }}</p>
            <div class="flex gap-2">
              <a routerLink="/appointments" class="btn-primary flex-1 text-sm py-2 text-center">Book Now</a>
              <button (click)="selected.set(doc)" class="btn-secondary text-sm py-2 px-4">Profile</button>
            </div>
          </div>
        }
      </div>

      @if (selected()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selected.set(null)">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up" (click)="$event.stopPropagation()">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <img src="https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg"
                  [alt]="selected()!.name" class="w-16 h-16 rounded-2xl object-cover shadow-md flex-shrink-0">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ selected()!.name }}</h2>
                  <p class="text-primary-600 font-medium">{{ selected()!.specialty }}</p>
                </div>
              </div>
              <button (click)="selected.set(null)" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ selected()!.bio }}</p>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="p-3 bg-gray-50 rounded-xl text-center">
                <p class="font-bold text-gray-900">{{ selected()!.experience }}+</p>
                <p class="text-xs text-gray-500">Years Experience</p>
              </div>
              <div class="p-3 bg-gray-50 rounded-xl text-center">
                <p class="font-bold text-gray-900">{{ selected()!.reviewCount }}</p>
                <p class="text-xs text-gray-500">Reviews</p>
              </div>
            </div>
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Available Days</p>
              <div class="flex gap-2 flex-wrap">
                @for (day of selected()!.availability; track day) {
                  <span class="badge badge-green">{{ day }}</span>
                }
              </div>
            </div>
            <a routerLink="/appointments" (click)="selected.set(null)" class="btn-primary w-full text-center block">Book Appointment</a>
          </div>
        </div>
      }
    </div>
  `
})
export class DoctorsComponent implements OnInit {
  doctors = signal<any[]>([]);
  search = '';
  specialty = '';
  selected = signal<any>(null);
  specialties = ['General Physician', 'Cardiologist', 'Nutritionist', 'Psychiatrist'];

  constructor(private health: HealthService) {}

  ngOnInit() {
    this.health.getDoctors().subscribe((docs: any[]) => this.doctors.set(docs));
  }

  filteredDoctors() {
    return this.doctors().filter(d => {
      const matchSearch = !this.search || d.name.toLowerCase().includes(this.search.toLowerCase()) || d.specialty.toLowerCase().includes(this.search.toLowerCase());
      const matchSpec = !this.specialty || d.specialty === this.specialty;
      return matchSearch && matchSpec;
    });
  }


}
