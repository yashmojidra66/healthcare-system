import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <i class="fas fa-heartbeat text-white text-sm"></i>
              </div>
              <span class="text-xl font-bold text-white">HealthCare+</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">Your complete health partner. Track, improve, and maintain your wellbeing with expert guidance.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Features</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/health-tracking" class="hover:text-white transition-colors">Health Tracking</a></li>
              <li><a routerLink="/meal-plans" class="hover:text-white transition-colors">Meal Plans</a></li>
              <li><a routerLink="/workouts" class="hover:text-white transition-colors">Workouts</a></li>
              <li><a routerLink="/mental-health" class="hover:text-white transition-colors">Mental Health</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Community</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/doctors" class="hover:text-white transition-colors">Find Doctors</a></li>
              <li><a routerLink="/appointments" class="hover:text-white transition-colors">Appointments</a></li>
              <li><a routerLink="/community" class="hover:text-white transition-colors">Community</a></li>
              <li><a routerLink="/blog" class="hover:text-white transition-colors">Health Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Connect</h4>
            <div class="flex gap-3">
              <a href="#" class="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"><i class="fab fa-twitter text-sm"></i></a>
              <a href="#" class="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"><i class="fab fa-instagram text-sm"></i></a>
              <a href="#" class="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"><i class="fab fa-linkedin text-sm"></i></a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 HealthCare Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
