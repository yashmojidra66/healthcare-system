import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
        <div class="flex-1 animate-fade-in">
          <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <i class="fas fa-star text-yellow-300"></i>
            <span>Trusted by 50,000+ users worldwide</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Modern Healthcare<br><span class="text-primary-200">Management</span>
          </h1>
          <p class="text-xl text-primary-100 mb-8 max-w-lg">Comprehensive healthcare management system connecting patients, doctors, and administrators for seamless medical care coordination.</p>
          <div class="flex flex-wrap gap-4">
            <a routerLink="/register" class="bg-white text-primary-700 font-bold py-3 px-8 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl active:scale-95">
              Get Started Free
            </a>
            <a routerLink="/doctors" class="border-2 border-white/50 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all">
              Find a Doctor
            </a>
          </div>
        </div>
        <div class="flex-1 grid grid-cols-2 gap-4 animate-slide-up">
          <div class="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
            <i class="fas fa-heartbeat text-3xl text-pink-300 mb-2"></i>
            <p class="font-bold text-2xl">98%</p>
            <p class="text-sm text-primary-200">User Satisfaction</p>
          </div>
          <div class="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
            <i class="fas fa-user-md text-3xl text-blue-300 mb-2"></i>
            <p class="font-bold text-2xl">200+</p>
            <p class="text-sm text-primary-200">Expert Doctors</p>
          </div>
          <div class="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
            <i class="fas fa-dumbbell text-3xl text-green-300 mb-2"></i>
            <p class="font-bold text-2xl">500+</p>
            <p class="text-sm text-primary-200">Workout Plans</p>
          </div>
          <div class="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
            <i class="fas fa-apple-alt text-3xl text-orange-300 mb-2"></i>
            <p class="font-bold text-2xl">300+</p>
            <p class="text-sm text-primary-200">Meal Plans</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Portal Access Section -->
    <section class="py-14 bg-gray-50 border-y border-gray-100">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <i class="fas fa-lock text-xs"></i> Secure Portal Access
          </span>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Choose Your Portal</h2>
          <p class="text-gray-500 text-base max-w-xl mx-auto">One platform, three tailored experiences — for patients, doctors, and administrators.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

          <!-- Patient -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
            <div class="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                  <i class="fas fa-user text-primary-600 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">Patient</h3>
                  <p class="text-xs text-gray-400">Personal health portal</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-5 text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Book & manage appointments</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Track health metrics daily</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Meal & workout plans</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Mental health tools</li>
              </ul>
              <div class="flex gap-2">
                <a routerLink="/login" class="flex-1 text-center py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                </a>
                <a routerLink="/register" class="flex-1 text-center py-2 px-3 border border-primary-200 text-primary-600 hover:bg-primary-50 text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-user-plus mr-1"></i>Register
                </a>
              </div>
            </div>
          </div>

          <!-- Doctor -->
          <div class="bg-white rounded-2xl border-2 border-primary-200 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative">
            <div class="h-1.5 bg-gradient-to-r from-green-400 to-primary-500"></div>
            <div class="absolute top-4 right-4">
              <span class="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                  <i class="fas fa-user-md text-green-600 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">Doctor</h3>
                  <p class="text-xs text-gray-400">Clinical management portal</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-5 text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs"></i>Patient management</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs"></i>Appointment scheduling</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs"></i>Prescriptions & records</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs"></i>Video consultations</li>
              </ul>
              <div class="flex gap-2">
                <a routerLink="/login" class="flex-1 text-center py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                </a>
                <a routerLink="/register" class="flex-1 text-center py-2 px-3 border border-green-200 text-green-600 hover:bg-green-50 text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-user-plus mr-1"></i>Register
                </a>
              </div>
            </div>
          </div>

          <!-- Admin -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div class="h-1.5 bg-gradient-to-r from-primary-600 to-primary-800"></div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                  <i class="fas fa-user-shield text-primary-700 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">Administrator</h3>
                  <p class="text-xs text-gray-400">System control panel</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-5 text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>User & doctor management</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Platform analytics</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Report generation</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs"></i>Security & settings</li>
              </ul>
              <a routerLink="/login" class="block text-center py-2 px-3 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl transition-all">
                <i class="fas fa-sign-in-alt mr-1"></i>Admin Sign In
              </a>
            </div>
          </div>

        </div>

        <!-- Demo hint — compact -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-400">
            <i class="fas fa-info-circle mr-1"></i>
            Demo — Patient: <span class="text-gray-600 font-medium">user&#64;health.com</span> &nbsp;·&nbsp;
            Doctor: <span class="text-gray-600 font-medium">doctor&#64;health.com</span> &nbsp;·&nbsp;
            Admin: <span class="text-gray-600 font-medium">admin&#64;health.com</span> &nbsp;·&nbsp;
            Password: <span class="text-gray-600 font-medium">pass1234</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Better Health</h2>
          <p class="text-gray-500 text-lg max-w-2xl mx-auto">A comprehensive platform designed to support every aspect of your health journey.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (feature of features; track feature.title) {
            <div class="card text-center hover:scale-105 transition-transform duration-200">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" [class]="feature.bg">
                <i [class]="feature.icon + ' text-2xl ' + feature.color"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ feature.desc }}</p>
              <a [routerLink]="feature.link" class="mt-4 inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:gap-2 transition-all">
                Learn more <i class="fas fa-arrow-right text-xs"></i>
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-gray-500 text-lg">Get started in 3 simple steps</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (step of steps; track step.num) {
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-extrabold flex items-center justify-center mx-auto mb-4 shadow-lg">{{ step.num }}</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ step.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (t of testimonials; track t.name) {
            <div class="card">
              <div class="flex items-center gap-1 mb-3">
                @for (s of [1,2,3,4,5]; track s) {
                  <i class="fas fa-star text-yellow-400 text-sm"></i>
                }
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
              <div class="flex items-center gap-3">
                <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + t.name" class="w-10 h-10 rounded-full">
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ t.name }}</p>
                  <p class="text-xs text-gray-400">{{ t.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          @for (stat of stats; track stat.label) {
            <div>
              <p class="text-4xl font-extrabold mb-1">{{ stat.value }}</p>
              <p class="text-primary-200 text-sm">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Ready to Transform Your Health?</h2>
        <p class="text-gray-500 text-lg mb-8">Join thousands of people who have already improved their wellbeing with HealthCare+.</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a routerLink="/register" class="btn-primary text-lg py-4 px-10">Start Your Journey Free</a>
          <a routerLink="/doctors" class="btn-secondary text-lg py-4 px-10">Find a Doctor</a>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  constructor(public auth: AuthService) {}

  features = [
    { title: 'Health Tracking', desc: 'Log daily metrics like calories, water, steps, sleep, and heart rate with beautiful charts.', icon: 'fas fa-chart-line', bg: 'bg-blue-100', color: 'text-blue-600', link: '/health-tracking' },
    { title: 'Expert Doctors', desc: 'Connect with certified doctors for in-person, video, or phone consultations.', icon: 'fas fa-user-md', bg: 'bg-green-100', color: 'text-green-600', link: '/doctors' },
    { title: 'Meal Plans', desc: 'Personalized nutrition plans crafted by dietitians to meet your health goals.', icon: 'fas fa-utensils', bg: 'bg-orange-100', color: 'text-orange-600', link: '/meal-plans' },
    { title: 'Workout Plans', desc: 'From beginner to advanced — structured workout programs for every fitness level.', icon: 'fas fa-dumbbell', bg: 'bg-purple-100', color: 'text-purple-600', link: '/workouts' },
    { title: 'Mental Health', desc: 'Track your mood, manage stress, and access mindfulness resources.', icon: 'fas fa-brain', bg: 'bg-pink-100', color: 'text-pink-600', link: '/mental-health' },
    { title: 'Community', desc: 'Share your journey, get inspired, and support others in our health community.', icon: 'fas fa-users', bg: 'bg-teal-100', color: 'text-teal-600', link: '/community' },
  ];

  steps = [
    { num: '1', title: 'Create Your Account', desc: 'Sign up as a patient, doctor, or admin. Takes less than 2 minutes to get started.' },
    { num: '2', title: 'Set Up Your Profile', desc: 'Add your health details, medical history, and personal goals for a tailored experience.' },
    { num: '3', title: 'Start Your Journey', desc: 'Book appointments, track health metrics, follow plans, and connect with your care team.' },
  ];

  testimonials = [
    { name: 'Sarah Johnson', role: 'Patient', text: 'HealthCare+ completely changed how I manage my health. Booking appointments is so easy and I love tracking my daily metrics.' },
    { name: 'Dr. Michael Chen', role: 'Cardiologist', text: 'The doctor portal is incredibly efficient. I can manage all my patients, prescriptions, and appointments from one place.' },
    { name: 'Emma Williams', role: 'Patient', text: 'The meal plans and workout tracking helped me lose 15kg in 6 months. The community support is amazing too!' },
  ];

  stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '200+', label: 'Expert Doctors' },
    { value: '1M+', label: 'Health Logs' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];
}

