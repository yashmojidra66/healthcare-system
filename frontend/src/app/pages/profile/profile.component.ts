import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
        <p class="text-gray-500 mt-1">Manage your personal health information</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Avatar Card -->
        <div class="card text-center">
          <img [src]="auth.currentUser()?.avatar" class="w-24 h-24 rounded-2xl mx-auto mb-4">
          <h3 class="font-bold text-gray-900 text-lg">{{ auth.currentUser()?.name }}</h3>
          <p class="text-primary-600 text-sm font-medium capitalize">{{ auth.currentUser()?.role }}</p>
          <p class="text-gray-500 text-sm mt-1">{{ auth.currentUser()?.email }}</p>
          <div class="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
            @if (auth.currentUser()?.bloodType) {
              <p><i class="fas fa-tint mr-2 text-red-400"></i>Blood Type: {{ auth.currentUser()?.bloodType }}</p>
            }
            @if (auth.currentUser()?.height) {
              <p><i class="fas fa-ruler-vertical mr-2 text-blue-400"></i>Height: {{ auth.currentUser()?.height }} cm</p>
            }
            @if (auth.currentUser()?.weight) {
              <p><i class="fas fa-weight mr-2 text-green-400"></i>Weight: {{ auth.currentUser()?.weight }} kg</p>
            }
          </div>
        </div>

        <!-- Edit Form -->
        <div class="lg:col-span-2 card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Personal Information</h3>
            <button (click)="editing.set(!editing())" class="text-sm text-primary-600 font-medium hover:underline">
              {{ editing() ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          @if (!editing()) {
            <div class="grid grid-cols-2 gap-4 text-sm">
              @for (field of displayFields; track field.label) {
                <div class="p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-400 text-xs mb-1">{{ field.label }}</p>
                  <p class="font-medium text-gray-800">{{ field.value || '—' }}</p>
                </div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="form.name" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" [(ngModel)]="form.phone" class="input-field" placeholder="+1 234 567 8900">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" [(ngModel)]="form.dateOfBirth" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select [(ngModel)]="form.gender" class="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" [(ngModel)]="form.height" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" [(ngModel)]="form.weight" step="0.1" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select [(ngModel)]="form.bloodType" class="input-field">
                  @for (bt of bloodTypes; track bt) { <option [value]="bt">{{ bt }}</option> }
                </select>
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button (click)="saveProfile()" class="btn-primary">Save Changes</button>
              <button (click)="editing.set(false)" class="btn-secondary">Cancel</button>
            </div>
            @if (saved()) {
              <div class="mt-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm animate-fade-in">
                <i class="fas fa-check-circle mr-2"></i>Profile updated successfully!
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  editing = signal(false);
  saved = signal(false);
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  form = {
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    height: 0,
    weight: 0,
    bloodType: 'O+',
  };

  constructor(public auth: AuthService) {
    const u = auth.currentUser();
    this.form = {
      name: u?.name || '',
      phone: u?.phone || '',
      dateOfBirth: u?.dateOfBirth || '',
      gender: u?.gender || 'male',
      height: u?.height || 0,
      weight: u?.weight || 0,
      bloodType: u?.bloodType || 'O+',
    };
  }

  get displayFields() {
    const u = this.auth.currentUser();
    return [
      { label: 'Full Name', value: u?.name },
      { label: 'Email', value: u?.email },
      { label: 'Phone', value: u?.phone },
      { label: 'Date of Birth', value: u?.dateOfBirth },
      { label: 'Gender', value: u?.gender },
      { label: 'Height', value: u?.height ? u.height + ' cm' : null },
      { label: 'Weight', value: u?.weight ? u.weight + ' kg' : null },
      { label: 'Blood Type', value: u?.bloodType },
    ];
  }

  saveProfile() {
    this.auth.updateProfile(this.form).subscribe({
      next: () => {
        this.editing.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      }
    });
  }
}
