import { Component, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-heartbeat text-white text-2xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Create account</h1>
          <p class="text-gray-500 mt-1">Start your health journey today</p>
        </div>

        <!-- Role selector tabs -->
        <div class="flex rounded-2xl bg-white shadow-sm border border-gray-200 p-1 mb-4">
          <button type="button" (click)="role = 'user'"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            [class]="role === 'user' ? 'bg-primary-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'">
            <i class="fas fa-user"></i> Patient
          </button>
          <button type="button" (click)="role = 'doctor'"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            [class]="role === 'doctor' ? 'bg-primary-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'">
            <i class="fas fa-user-md"></i> Doctor
          </button>
        </div>

        <div class="card">
          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm flex items-center gap-2">
              <i class="fas fa-exclamation-circle"></i> {{ error() }}
            </div>
          }
          @if (success()) {
            <div class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4 text-sm text-center">
              <i class="fas fa-check-circle text-2xl mb-2 block"></i>
              <p class="font-semibold">Registration submitted!</p>
              <p class="mt-1 text-green-600">Your doctor account is pending admin approval. You'll be able to login once approved.</p>
              <a routerLink="/login" class="mt-3 inline-block text-primary-600 font-semibold hover:underline">Back to Login</a>
            </div>
          }

          @if (!success()) {
            <form (ngSubmit)="onSubmit()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="name" name="name" required
                  class="input-field" [placeholder]="role === 'doctor' ? 'Dr. John Smith' : 'John Doe'">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" [(ngModel)]="email" name="email" required
                  class="input-field" placeholder="you@example.com">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" [(ngModel)]="password" name="password" required minlength="4"
                  class="input-field" placeholder="Min. 4 characters">
              </div>

              @if (role === 'doctor') {
                <div class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p class="text-xs text-blue-700 font-medium mb-3 flex items-center gap-1">
                    <i class="fas fa-info-circle"></i> Doctor details (reviewed by admin)
                  </p>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                      <label class="block text-xs font-medium text-gray-700 mb-1">Specialty</label>
                      <select [(ngModel)]="specialty" name="specialty" class="input-field text-sm">
                        <option value="">Select specialty</option>
                        <option>General Physician</option>
                        <option>Cardiologist</option>
                        <option>Nutritionist</option>
                        <option>Psychiatrist</option>
                        <option>Dermatologist</option>
                        <option>Pediatrician</option>
                        <option>Orthopedist</option>
                        <option>Neurologist</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Experience (yrs)</label>
                      <input type="number" [(ngModel)]="experience" name="experience" min="0"
                        class="input-field text-sm" placeholder="5">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Fee ($/visit)</label>
                      <input type="number" [(ngModel)]="consultationFee" name="consultationFee" min="0"
                        class="input-field text-sm" placeholder="100">
                    </div>
                    <div class="col-span-2">
                      <label class="block text-xs font-medium text-gray-700 mb-1">Hospital / Clinic</label>
                      <input type="text" [(ngModel)]="hospital" name="hospital"
                        class="input-field text-sm" placeholder="City Medical Center">
                    </div>
                    <div class="col-span-2">
                      <label class="block text-xs font-medium text-gray-700 mb-1">Short Bio</label>
                      <textarea [(ngModel)]="bio" name="bio" rows="2"
                        class="input-field text-sm resize-none" placeholder="Brief professional summary..."></textarea>
                    </div>
                  </div>
                </div>
              }

              <button type="submit" [disabled]="loading()" class="btn-primary w-full mt-2">
                @if (loading()) { <i class="fas fa-spinner fa-spin mr-2"></i> }
                {{ role === 'doctor' ? 'Submit for Approval' : 'Create Account' }}
              </button>
            </form>
          }

          <p class="text-center text-sm text-gray-500 mt-4">
            Already have an account? <a routerLink="/login" class="text-primary-600 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role: 'user' | 'doctor' = 'user';
  specialty = '';
  experience: number | null = null;
  consultationFee: number | null = null;
  hospital = '';
  bio = '';

  error = signal('');
  loading = signal(false);
  success = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');

    const payload: any = { name: this.name, email: this.email, password: this.password, role: this.role };
    if (this.role === 'doctor') {
      Object.assign(payload, {
        specialty: this.specialty, experience: this.experience,
        consultationFee: this.consultationFee, hospital: this.hospital, bio: this.bio
      });
    }

    this.auth.register(payload.name, payload.email, payload.password, payload.role, payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (this.role === 'doctor') {
          this.success.set(true); // show pending message, don't redirect
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
