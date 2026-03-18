import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- ===== HERO ===== -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary-300 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24
                  flex flex-col md:flex-row items-center gap-8 md:gap-12">

        <!-- Left text -->
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl
                     font-extrabold leading-tight mb-4 md:mb-6">
            Modern Medicare<br>
            <span class="text-primary-200">System</span>
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-primary-100
                    mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
            Connecting patients, doctors, and administrators for seamless medical care coordination.
          </p>
          <div class="flex flex-wrap gap-3 justify-center md:justify-start">
            <a routerLink="/register"
               class="bg-white text-primary-700 font-bold py-2.5 sm:py-3 px-5 sm:px-8
                      rounded-xl hover:bg-primary-50 transition-all shadow-lg
                      hover:shadow-xl active:scale-95 text-sm sm:text-base">
              Get Started Free
            </a>
            <a routerLink="/doctors"
               class="border-2 border-white/50 text-white font-semibold
                      py-2.5 sm:py-3 px-5 sm:px-8 rounded-xl hover:bg-white/10
                      transition-all text-sm sm:text-base">
              Find a Doctor
            </a>
          </div>
        </div>

        <!-- Right stats grid -->
        <div class="w-full md:flex-1 grid grid-cols-2 gap-3 max-w-xs sm:max-w-sm mx-auto md:max-w-none">
          @for (s of heroStats; track s.label) {
            <div class="bg-white/15 backdrop-blur rounded-2xl p-3 sm:p-5 text-center">
              <i [class]="s.icon + ' text-xl sm:text-3xl mb-1 sm:mb-2 ' + s.color"></i>
              <p class="font-bold text-lg sm:text-2xl">{{ s.value }}</p>
              <p class="text-xs sm:text-sm text-primary-200">{{ s.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== PORTAL ACCESS ===== -->
    <section class="py-10 sm:py-14 bg-gray-50 border-y border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-10">
          <span class="inline-flex items-center gap-2 bg-primary-50 text-primary-700
                       text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <i class="fas fa-lock text-xs"></i> Secure Portal Access
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Portal</h2>
          <p class="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            One platform, three tailored experiences — for patients, doctors, and administrators.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <!-- Patient -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div class="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 sm:w-11 sm:h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user text-primary-600 text-base sm:text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg leading-tight">Patient</h3>
                  <p class="text-xs text-gray-400">Personal health portal</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-4 text-xs sm:text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Book & manage appointments</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Track health metrics daily</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Meal & workout plans</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Mental health tools</li>
              </ul>
              <div class="flex gap-2">
                <a routerLink="/login" class="flex-1 text-center py-2 px-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                </a>
                <a routerLink="/register" class="flex-1 text-center py-2 px-2 border border-primary-200 text-primary-600 hover:bg-primary-50 text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-user-plus mr-1"></i>Register
                </a>
              </div>
            </div>
          </div>

          <!-- Doctor -->
          <div class="bg-white rounded-2xl border-2 border-primary-200 shadow-md hover:shadow-lg transition-all overflow-hidden relative">
            <div class="h-1.5 bg-gradient-to-r from-green-400 to-primary-500"></div>
            <div class="absolute top-3 right-3">
              <span class="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 sm:w-11 sm:h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user-md text-green-600 text-base sm:text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg leading-tight">Doctor</h3>
                  <p class="text-xs text-gray-400">Clinical management portal</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-4 text-xs sm:text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs flex-shrink-0"></i>Patient management</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs flex-shrink-0"></i>Appointment scheduling</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs flex-shrink-0"></i>Prescriptions & records</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-green-500 text-xs flex-shrink-0"></i>Video consultations</li>
              </ul>
              <div class="flex gap-2">
                <a routerLink="/login" class="flex-1 text-center py-2 px-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                </a>
                <a routerLink="/register" class="flex-1 text-center py-2 px-2 border border-green-200 text-green-600 hover:bg-green-50 text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  <i class="fas fa-user-plus mr-1"></i>Register
                </a>
              </div>
            </div>
          </div>

          <!-- Admin -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div class="h-1.5 bg-gradient-to-r from-primary-600 to-primary-800"></div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 sm:w-11 sm:h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user-shield text-primary-700 text-base sm:text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg leading-tight">Administrator</h3>
                  <p class="text-xs text-gray-400">System control panel</p>
                </div>
              </div>
              <ul class="space-y-1.5 mb-4 text-xs sm:text-sm text-gray-500">
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>User & doctor management</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Platform analytics</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Report generation</li>
                <li class="flex items-center gap-2"><i class="fas fa-check-circle text-primary-500 text-xs flex-shrink-0"></i>Security & settings</li>
              </ul>
              <a routerLink="/login" class="block text-center py-2 px-3 bg-primary-700 hover:bg-primary-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all">
                <i class="fas fa-sign-in-alt mr-1"></i>Admin Sign In
              </a>
            </div>
          </div>

        </div>

        <!-- Demo hint -->
        <div class="mt-5 sm:mt-6 text-center">
          <p class="text-xs text-gray-400 flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span><i class="fas fa-info-circle mr-1"></i>Demo credentials:</span>
            <span>Patient: <span class="text-gray-600 font-medium">user&#64;health.com</span></span>
            <span>Doctor: <span class="text-gray-600 font-medium">doctor&#64;health.com</span></span>
            <span>Admin: <span class="text-gray-600 font-medium">admin&#64;health.com</span></span>
            <span>Pass: <span class="text-gray-600 font-medium">pass1234</span></span>
          </p>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section class="py-10 sm:py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12 md:mb-14">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Everything You Need for Better Health
          </h2>
          <p class="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            A comprehensive platform designed to support every aspect of your health journey.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          @for (feature of features; track feature.title) {
            <div class="card text-center hover:scale-[1.03] transition-transform duration-200 p-5 sm:p-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" [class]="feature.bg">
                <i [class]="feature.icon + ' text-lg sm:text-2xl ' + feature.color"></i>
              </div>
              <h3 class="text-base sm:text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-500 text-xs sm:text-sm leading-relaxed">{{ feature.desc }}</p>
              <a [routerLink]="feature.link" class="mt-3 sm:mt-4 inline-flex items-center gap-1 text-primary-600 text-xs sm:text-sm font-semibold hover:gap-2 transition-all">
                Learn more <i class="fas fa-arrow-right text-xs"></i>
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="py-10 sm:py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12 md:mb-14">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p class="text-gray-500 text-sm sm:text-base md:text-lg">Get started in 3 simple steps</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          @for (step of steps; track step.num) {
            <div class="text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-600 text-white
                          text-lg sm:text-2xl font-extrabold flex items-center justify-center
                          mx-auto mb-3 sm:mb-4 shadow-lg">
                {{ step.num }}
              </div>
              <h3 class="text-base sm:text-xl font-bold text-gray-900 mb-2">{{ step.title }}</h3>
              <p class="text-gray-500 text-xs sm:text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="py-10 sm:py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-8 sm:mb-12 md:mb-14">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Users Say</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          @for (t of testimonials; track t.name) {
            <div class="card p-4 sm:p-6">
              <div class="flex items-center gap-0.5 mb-3">
                @for (s of [1,2,3,4,5]; track s) {
                  <i class="fas fa-star text-yellow-400 text-xs sm:text-sm"></i>
                }
              </div>
              <p class="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
              <div class="flex items-center gap-3">
                <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + t.name" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0">
                <div>
                  <p class="font-semibold text-gray-900 text-xs sm:text-sm">{{ t.name }}</p>
                  <p class="text-xs text-gray-400">{{ t.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="py-10 sm:py-14 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          @for (stat of stats; track stat.label) {
            <div class="py-2">
              <p class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1">{{ stat.value }}</p>
              <p class="text-primary-200 text-xs sm:text-sm">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="py-10 sm:py-16 md:py-20 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Ready to Transform Your Health?
        </h2>
        <p class="text-gray-500 text-sm sm:text-base md:text-lg mb-6 md:mb-8">
          Join thousands of people who have already improved their wellbeing with Modern Medicare System.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <a routerLink="/register" class="btn-primary text-sm sm:text-base py-3 px-6 sm:px-10">
            Start Your Journey Free
          </a>
          <a routerLink="/doctors" class="btn-secondary text-sm sm:text-base py-3 px-6 sm:px-10">
            Find a Doctor
          </a>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  constructor(public auth: AuthService) {}

  heroStats = [
    { value: '98%', label: 'User Satisfaction', icon: 'fas fa-heartbeat', color: 'text-pink-300' },
    { value: '200+', label: 'Expert Doctors', icon: 'fas fa-user-md', color: 'text-blue-300' },
    { value: '500+', label: 'Workout Plans', icon: 'fas fa-dumbbell', color: 'text-green-300' },
    { value: '300+', label: 'Meal Plans', icon: 'fas fa-apple-alt', color: 'text-orange-300' },
  ];

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
    { name: 'Sarah Johnson', role: 'Patient', text: 'Modern Medicare System completely changed how I manage my health. Booking appointments is so easy and I love tracking my daily metrics.' },
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
