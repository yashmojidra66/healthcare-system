import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

type Tab = 'overview' | 'pending' | 'doctors' | 'users' | 'appointments' | 'community' | 'mealplans' | 'workoutplans';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex h-screen bg-gray-50 overflow-hidden">

  <!-- Mobile overlay -->
  @if (mobileOpen()) {
    <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" (click)="mobileOpen.set(false)"></div>
  }

  <!-- ── SIDEBAR ── -->
  <aside [class]="mobileOpen() ? 'fixed z-50 translate-x-0' : 'fixed z-50 -translate-x-full lg:relative lg:translate-x-0'"
    class="w-64 flex-shrink-0 bg-white flex flex-col border-r border-gray-200 shadow-sm transition-transform duration-300 h-full">
    <!-- Logo -->
    <div class="flex items-center justify-between gap-3 px-5 py-5 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="fas fa-shield-alt text-white text-sm"></i>
        </div>
        <div>
          <p class="text-gray-900 font-bold text-sm leading-tight">Modern Medicare</p>
          <p class="text-gray-400 text-xs">Admin Console</p>
        </div>
      </div>
      <button (click)="mobileOpen.set(false)" class="lg:hidden text-gray-400 hover:text-gray-600 p-1">
        <i class="fas fa-times text-sm"></i>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      @for (item of navItems; track item.id) {
        <button (click)="setTab(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          [class]="activeTab() === item.id
            ? 'bg-primary-50 text-primary-700 border border-primary-200'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'">
          <i [class]="item.icon + ' w-4 text-center'"></i>
          <span>{{ item.label }}</span>
          @if (item.id === 'pending' && pendingDoctors().length > 0) {
            <span class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ pendingDoctors().length }}
            </span>
          }
        </button>
      }
    </nav>

    <!-- User + Logout -->
    <div class="px-3 py-4 border-t border-gray-100">
      <div class="flex items-center gap-3 px-3 py-2 mb-2">
        <img [src]="auth.currentUser()?.avatar || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'"
          class="w-8 h-8 rounded-full">
        <div class="flex-1 min-w-0">
          <p class="text-gray-900 text-xs font-semibold truncate">{{ auth.currentUser()?.name }}</p>
          <p class="text-gray-400 text-xs">Administrator</p>
        </div>
      </div>
      <button (click)="logout()"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 transition-all">
        <i class="fas fa-sign-out-alt w-4 text-center"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- ── MAIN CONTENT ── -->
  <div class="flex-1 flex flex-col overflow-hidden min-w-0">

    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3 min-w-0">
        <button (click)="mobileOpen.set(true)" class="lg:hidden text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 flex-shrink-0">
          <i class="fas fa-bars"></i>
        </button>
        <div class="min-w-0">
          <h1 class="text-gray-900 font-bold text-base sm:text-lg truncate">{{ currentTabLabel() }}</h1>
          <p class="text-gray-400 text-xs hidden sm:block">Modern Medicare Admin Panel</p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <button (click)="loadAll()" class="text-gray-400 hover:text-gray-700 transition-colors p-2" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
        <span class="text-xs text-gray-400 hidden sm:block">{{ today }}</span>
      </div>
    </header>

    <!-- Scrollable content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">

      <!-- ── OVERVIEW ── -->
      @if (activeTab() === 'overview') {
        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          @for (s of stats(); track s.label) {
            <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" [class]="s.bg">
                <i [class]="s.icon + ' ' + s.color"></i>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ s.value }}</p>
                <p class="text-xs text-gray-500">{{ s.label }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Pending alert -->
        @if (pendingDoctors().length > 0) {
          <div class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-clock text-orange-500 text-xl"></i>
              <div>
                <p class="text-gray-900 font-semibold">{{ pendingDoctors().length }} doctor(s) awaiting approval</p>
                <p class="text-gray-500 text-sm">Review and approve or reject their applications</p>
              </div>
            </div>
            <button (click)="activeTab.set('pending')" class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Review Now
            </button>
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent users -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-gray-900 font-bold mb-4">Recent Registrations</h3>
            <div class="space-y-3">
              @for (u of allUsers().concat(allDoctors()).slice(0,6); track u.id) {
                <div class="flex items-center gap-3">
                  <img [src]="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+u.name" class="w-9 h-9 rounded-full">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ u.name }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ u.email }}</p>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="rolePill(u.role)">{{ u.role }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="statusPill(u.status)">{{ u.status || 'active' }}</span>
                </div>
              }
            </div>
          </div>
          <!-- Quick stats -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-gray-900 font-bold mb-4">Platform Health</h3>
            <div class="space-y-4">
              @for (m of systemMetrics; track m.label) {
                <div>
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-gray-500">{{ m.label }}</span>
                    <span class="font-bold text-gray-900">{{ m.value }}%</span>
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" [class]="m.color" [style.width.%]="m.value"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- ── PENDING DOCTORS ── -->
      @if (activeTab() === 'pending') {
        @if (pendingDoctors().length === 0) {
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
            <p class="text-xl font-bold text-gray-900">All caught up!</p>
            <p class="text-gray-400 mt-1">No pending doctor approvals</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            @for (doc of pendingDoctors(); track doc.id) {
              <div class="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
                <div class="flex items-start gap-3 mb-4">
                  <img [src]="doc.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+doc.name" class="w-12 h-12 rounded-xl">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 truncate">{{ doc.name }}</p>
                    <p class="text-sm text-primary-600">{{ doc.specialty || 'No specialty' }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ doc.email }}</p>
                  </div>
                  <span class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Pending</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center mb-4">
                  <div class="bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <p class="font-bold text-gray-900 text-sm">{{ doc.experience || '—' }}</p>
                    <p class="text-xs text-gray-400">Yrs</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <p class="font-bold text-gray-900 text-sm">\${{ doc.consultationFee || '—' }}</p>
                    <p class="text-xs text-gray-400">Fee</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <p class="font-bold text-gray-900 text-xs truncate">{{ doc.hospital || '—' }}</p>
                    <p class="text-xs text-gray-400">Hospital</p>
                  </div>
                </div>
                @if (doc.bio) {
                  <p class="text-xs text-gray-400 mb-4 line-clamp-2">{{ doc.bio }}</p>
                }
                <div class="flex gap-2">
                  <button (click)="approveDoctor(doc.id)"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
                    <i class="fas fa-check mr-1"></i>Approve
                  </button>
                  <button (click)="rejectDoctor(doc.id)"
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
                    <i class="fas fa-times mr-1"></i>Reject
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }

      <!-- ── ALL DOCTORS ── -->
      @if (activeTab() === 'doctors') {
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <input type="text" [(ngModel)]="doctorSearch" placeholder="Search doctors..."
            class="flex-1 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400">
          <select [(ngModel)]="doctorStatusFilter"
            class="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 sm:w-40">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Doctor</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Specialty</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Hospital</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of filteredDoctors(); track doc.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <img [src]="doc.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+doc.name" class="w-8 h-8 rounded-full">
                      <div>
                        <p class="font-semibold text-gray-900 text-sm">{{ doc.name }}</p>
                        <p class="text-xs text-gray-400">{{ doc.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-500 hidden md:table-cell">{{ doc.specialty || '—' }}</td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">{{ doc.hospital || '—' }}</td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="statusPill(doc.status)">{{ doc.status || 'active' }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-1 flex-wrap">
                      @if (doc.status === 'pending' || doc.status === 'rejected') {
                        <button (click)="approveDoctor(doc.id)" class="text-xs bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Approve</button>
                      }
                      @if (doc.status === 'active' || doc.status === 'pending') {
                        <button (click)="rejectDoctor(doc.id)" class="text-xs bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-lg transition-colors">
                          {{ doc.status === 'active' ? 'Suspend' : 'Reject' }}
                        </button>
                      }
                      <button (click)="deleteUser(doc.id)" class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredDoctors().length === 0) {
            <p class="text-center text-gray-400 py-10">No doctors found</p>
          }
        </div>
      }

      <!-- ── USERS ── -->
      @if (activeTab() === 'users') {
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
          <input type="text" [(ngModel)]="userSearch" placeholder="Search users by name or email..."
            class="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400">
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Joined</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (u of filteredUsers(); track u.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <img [src]="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+u.name" class="w-8 h-8 rounded-full">
                      <div>
                        <p class="font-semibold text-gray-900 text-sm">{{ u.name }}</p>
                        <p class="text-xs text-gray-400">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{{ u.createdAt | date:'MMM d, y' }}</td>
                  <td class="py-3 px-4">
                    <button (click)="deleteUser(u.id)" class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg transition-colors">
                      <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredUsers().length === 0) {
            <p class="text-center text-gray-400 py-10">No users found</p>
          }
        </div>
      }

      <!-- ── APPOINTMENTS ── -->
      @if (activeTab() === 'appointments') {
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-gray-900 font-bold">All Appointments</h3>
            <span class="text-sm text-gray-400">{{ appointments().length }} total</span>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Doctor</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Date & Time</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Type</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (appt of appointments(); track appt.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4 text-gray-900 font-medium">{{ appt.doctorName }}</td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{{ appt.date | date:'MMM d, y' }} · {{ appt.time }}</td>
                  <td class="py-3 px-4 hidden sm:table-cell">
                    <span class="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{{ appt.type }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <button (click)="deleteAppointment(appt.id)" class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (appointments().length === 0) {
            <p class="text-center text-gray-400 py-10">No appointments yet</p>
          }
        </div>
      }

      <!-- ── COMMUNITY ── -->
      @if (activeTab() === 'community') {
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-gray-900 font-bold">Community Posts</h3>
            <span class="text-sm text-gray-400">{{ communityPosts().length }} posts</span>
          </div>
          <div class="divide-y divide-gray-100">
            @for (post of communityPosts(); track post.id) {
              <div class="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
                <img [src]="post.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+post.userName" class="w-9 h-9 rounded-full flex-shrink-0">
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 font-semibold text-sm">{{ post.userName }}</p>
                  <p class="text-gray-500 text-sm mt-0.5 line-clamp-2">{{ post.content }}</p>
                  <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span><i class="fas fa-heart mr-1 text-red-400"></i>{{ post.likes }}</span>
                    <span>{{ post.createdAt | date:'MMM d, y' }}</span>
                  </div>
                </div>
                <button (click)="deleteCommunityPost(post._id || post.id)" class="text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors flex-shrink-0">Delete</button>
              </div>
            }
            @if (communityPosts().length === 0) {
              <p class="text-center text-gray-400 py-10">No community posts</p>
            }
          </div>
        </div>
      }

      <!-- ── DIET PLANS ── -->
      @if (activeTab() === 'mealplans') {
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-900 font-bold text-lg">Diet Plans ({{ mealPlans().length }})</h3>
          <button (click)="openMealForm()" class="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <i class="fas fa-plus mr-2"></i>Add Diet Plan
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (plan of mealPlans(); track plan._id || plan.id) {
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <img [src]="plan.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'"
                class="w-full h-36 object-cover">
              <div class="p-4">
                <p class="text-gray-900 font-bold mb-1">{{ plan.name }}</p>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">{{ plan.description }}</p>
                <div class="grid grid-cols-4 gap-1 text-center mb-3">
                  <div class="bg-orange-50 rounded-lg p-1.5">
                    <p class="text-orange-500 font-bold text-xs">{{ plan.calories }}</p>
                    <p class="text-gray-400 text-xs">kcal</p>
                  </div>
                  <div class="bg-blue-50 rounded-lg p-1.5">
                    <p class="text-blue-500 font-bold text-xs">{{ plan.protein }}g</p>
                    <p class="text-gray-400 text-xs">protein</p>
                  </div>
                  <div class="bg-yellow-50 rounded-lg p-1.5">
                    <p class="text-yellow-500 font-bold text-xs">{{ plan.carbs }}g</p>
                    <p class="text-gray-400 text-xs">carbs</p>
                  </div>
                  <div class="bg-red-50 rounded-lg p-1.5">
                    <p class="text-red-500 font-bold text-xs">{{ plan.fat }}g</p>
                    <p class="text-gray-400 text-xs">fat</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1 mb-3">
                  @for (tag of (plan.tags || []).slice(0,3); track tag) {
                    <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ tag }}</span>
                  }
                </div>
                <div class="flex gap-2">
                  <button (click)="openMealForm(plan)" class="flex-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white py-1.5 rounded-lg transition-colors">
                    <i class="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button (click)="deleteMealPlan(plan._id || plan.id)" class="flex-1 text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white py-1.5 rounded-lg transition-colors">
                    <i class="fas fa-trash mr-1"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          }
          @if (mealPlans().length === 0) {
            <div class="col-span-3 text-center text-gray-400 py-16">
              <i class="fas fa-utensils text-4xl mb-3 block"></i>
              <p>No diet plans yet. Add one!</p>
            </div>
          }
        </div>

        @if (showMealForm()) {
          <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showMealForm.set(false)">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-gray-900 font-bold text-lg">{{ editingMeal() ? 'Edit' : 'New' }} Diet Plan</h3>
                <button (click)="showMealForm.set(false)" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Name</label>
                  <input [(ngModel)]="mealForm.name" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400" placeholder="Mediterranean Diet">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea [(ngModel)]="mealForm.description" rows="2" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 resize-none"></textarea>
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Calories (kcal)</label>
                  <input type="number" [(ngModel)]="mealForm.calories" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Protein (g)</label>
                  <input type="number" [(ngModel)]="mealForm.protein" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Carbs (g)</label>
                  <input type="number" [(ngModel)]="mealForm.carbs" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Fat (g)</label>
                  <input type="number" [(ngModel)]="mealForm.fat" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Tags (comma-separated)</label>
                  <input [(ngModel)]="mealForm.tags" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400" placeholder="heart-healthy, balanced">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Image URL</label>
                  <input [(ngModel)]="mealForm.imageUrl" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400" placeholder="https://...">
                </div>
              </div>
              <div class="flex gap-3 mt-5">
                <button (click)="saveMealPlan()" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  {{ editingMeal() ? 'Update' : 'Create' }} Plan
                </button>
                <button (click)="showMealForm.set(false)" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">Cancel</button>
              </div>
            </div>
          </div>
        }
      }

      <!-- ── WORKOUT PLANS ── -->
      @if (activeTab() === 'workoutplans') {
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-900 font-bold text-lg">Workout Plans ({{ workoutPlans().length }})</h3>
          <button (click)="openWorkoutForm()" class="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <i class="fas fa-plus mr-2"></i>Add Workout Plan
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (plan of workoutPlans(); track plan._id || plan.id) {
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="relative">
                <img [src]="plan.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'"
                  class="w-full h-36 object-cover">
                <div class="absolute top-2 left-2 flex gap-1">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                    [class]="plan.level === 'beginner' ? 'bg-green-500 text-white' : plan.level === 'intermediate' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'">
                    {{ plan.level }}
                  </span>
                  <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700">{{ plan.category }}</span>
                </div>
              </div>
              <div class="p-4">
                <p class="text-gray-900 font-bold mb-1">{{ plan.name }}</p>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">{{ plan.description }}</p>
                <div class="grid grid-cols-3 gap-1 text-center mb-3">
                  <div class="bg-blue-50 rounded-lg p-1.5">
                    <p class="text-blue-500 font-bold text-xs">{{ plan.duration }}m</p>
                    <p class="text-gray-400 text-xs">duration</p>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-1.5">
                    <p class="text-orange-500 font-bold text-xs">{{ plan.caloriesBurn }}</p>
                    <p class="text-gray-400 text-xs">kcal</p>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-1.5">
                    <p class="text-purple-500 font-bold text-xs">{{ plan.exercises?.length || 0 }}</p>
                    <p class="text-gray-400 text-xs">exercises</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1 mb-3">
                  @for (tag of (plan.tags || []).slice(0,3); track tag) {
                    <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ tag }}</span>
                  }
                </div>
                <div class="flex gap-2">
                  <button (click)="openWorkoutForm(plan)" class="flex-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white py-1.5 rounded-lg transition-colors">
                    <i class="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button (click)="deleteWorkoutPlan(plan._id || plan.id)" class="flex-1 text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white py-1.5 rounded-lg transition-colors">
                    <i class="fas fa-trash mr-1"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          }
          @if (workoutPlans().length === 0) {
            <div class="col-span-3 text-center text-gray-400 py-16">
              <i class="fas fa-dumbbell text-4xl mb-3 block"></i>
              <p>No workout plans yet. Add one!</p>
            </div>
          }
        </div>

        @if (showWorkoutForm()) {
          <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showWorkoutForm.set(false)">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-gray-900 font-bold text-lg">{{ editingWorkout() ? 'Edit' : 'New' }} Workout Plan</h3>
                <button (click)="showWorkoutForm.set(false)" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Name</label>
                  <input [(ngModel)]="workoutForm.name" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="Full Body Blast">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea [(ngModel)]="workoutForm.description" rows="2" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none"></textarea>
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Level</label>
                  <select [(ngModel)]="workoutForm.level" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
                    @for (lvl of workoutLevels; track lvl) {
                      <option [value]="lvl">{{ lvl | titlecase }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Category</label>
                  <select [(ngModel)]="workoutForm.category" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
                    @for (cat of workoutCategories; track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Duration (min)</label>
                  <input type="number" [(ngModel)]="workoutForm.duration" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">Calories Burn</label>
                  <input type="number" [(ngModel)]="workoutForm.caloriesBurn" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Tags (comma-separated)</label>
                  <input [(ngModel)]="workoutForm.tags" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="hiit, cardio, fat-burn">
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-500 mb-1 block">Image URL</label>
                  <input [(ngModel)]="workoutForm.imageUrl" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="https://...">
                </div>
              </div>
              <div class="flex gap-3 mt-5">
                <button (click)="saveWorkoutPlan()" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  {{ editingWorkout() ? 'Update' : 'Create' }} Plan
                </button>
                <button (click)="showWorkoutForm.set(false)" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">Cancel</button>
              </div>
            </div>
          </div>
        }
      }

    </main>
  </div>

  <!-- Toast -->
  @if (toast()) {
    <div class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium"
      [class]="toastType() === 'success' ? 'bg-green-600' : 'bg-red-600'">
      <i [class]="toastType() === 'success' ? 'fas fa-check mr-2' : 'fas fa-times mr-2'"></i>{{ toast() }}
    </div>
  }
</div>
  `
})
export class AdminComponent implements OnInit {
  private api = environment.apiUrl;

  activeTab = signal<Tab>('overview');
  mobileOpen = signal(false);

  stats = signal<any[]>([
    { label: 'Total Patients', value: '—', icon: 'fas fa-users', bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Active Doctors', value: '—', icon: 'fas fa-user-md', bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Appointments', value: '—', icon: 'fas fa-calendar', bg: 'bg-purple-100', color: 'text-purple-600' },
    { label: 'Community Posts', value: '—', icon: 'fas fa-comments', bg: 'bg-orange-100', color: 'text-orange-600' },
  ]);

  pendingDoctors = signal<any[]>([]);
  allDoctors = signal<any[]>([]);
  allUsers = signal<any[]>([]);
  appointments = signal<any[]>([]);
  communityPosts = signal<any[]>([]);
  mealPlans = signal<any[]>([]);
  workoutPlans = signal<any[]>([]);
  toast = signal('');
  toastType = signal<'success' | 'error'>('success');

  // Meal plan form
  showMealForm = signal(false);
  editingMeal = signal<any>(null);
  mealForm: any = { name: '', description: '', calories: 0, protein: 0, carbs: 0, fat: 0, tags: '', imageUrl: '' };

  // Workout plan form
  showWorkoutForm = signal(false);
  editingWorkout = signal<any>(null);
  workoutForm: any = { name: '', description: '', level: 'beginner', duration: 30, category: 'Strength', caloriesBurn: 0, tags: '', imageUrl: '' };

  workoutCategories = ['Strength', 'Cardio', 'Flexibility', 'Yoga', 'HIIT', 'Sports'];
  workoutLevels = ['beginner', 'intermediate', 'advanced'];

  doctorSearch = '';
  doctorStatusFilter = '';
  userSearch = '';

  today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  navItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'pending' as Tab, label: 'Pending Doctors', icon: 'fas fa-clock' },
    { id: 'doctors' as Tab, label: 'All Doctors', icon: 'fas fa-user-md' },
    { id: 'users' as Tab, label: 'Patients', icon: 'fas fa-users' },
    { id: 'appointments' as Tab, label: 'Appointments', icon: 'fas fa-calendar-alt' },
    { id: 'community' as Tab, label: 'Community', icon: 'fas fa-comments' },
    { id: 'mealplans' as Tab, label: 'Diet Plans', icon: 'fas fa-utensils' },
    { id: 'workoutplans' as Tab, label: 'Workout Plans', icon: 'fas fa-dumbbell' },
  ];

  systemMetrics = [
    { label: 'Server Uptime', value: 99, color: 'bg-green-500' },
    { label: 'Storage Used', value: 67, color: 'bg-blue-500' },
    { label: 'API Response', value: 94, color: 'bg-purple-500' },
  ];

  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() { this.loadAll(); }

  currentTabLabel() {
    return this.navItems.find(n => n.id === this.activeTab())?.label || 'Admin';
  }

  setTab(id: Tab) {
    this.activeTab.set(id);
    this.mobileOpen.set(false);
  }

  loadAll() {
    this.http.get<any>(`${this.api}/admin/stats`).subscribe({ next: res => {
      const d = res.data;
      this.stats.set([
        { label: 'Total Patients', value: String(d.totalUsers), icon: 'fas fa-users', bg: 'bg-blue-100', color: 'text-blue-600' },
        { label: 'Active Doctors', value: String(d.totalDoctors), icon: 'fas fa-user-md', bg: 'bg-green-100', color: 'text-green-600' },
        { label: 'Appointments', value: String(d.totalAppointments), icon: 'fas fa-calendar', bg: 'bg-purple-100', color: 'text-purple-600' },
        { label: 'Community Posts', value: String(d.totalPosts), icon: 'fas fa-comments', bg: 'bg-orange-100', color: 'text-orange-600' },
      ]);
    }});
    this.http.get<any>(`${this.api}/admin/pending-doctors`).subscribe({ next: res => this.pendingDoctors.set(res.data) });
    this.http.get<any>(`${this.api}/admin/users`).subscribe({ next: res => {
      this.allUsers.set(res.data.filter((u: any) => u.role === 'user'));
      this.allDoctors.set(res.data.filter((u: any) => u.role === 'doctor'));
    }});
    this.http.get<any>(`${this.api}/appointments`).subscribe({ next: res => this.appointments.set(res.data || []), error: () => {} });
    this.http.get<any>(`${this.api}/community`).subscribe({ next: res => this.communityPosts.set(res.data || []), error: () => {} });
    this.http.get<any>(`${this.api}/meal-plans`).subscribe({ next: res => this.mealPlans.set(res.data || []), error: () => {} });
    this.http.get<any>(`${this.api}/workouts`).subscribe({ next: res => this.workoutPlans.set(res.data || []), error: () => {} });
  }

  approveDoctor(id: string) {
    this.http.put<any>(`${this.api}/admin/users/${id}/approve`, {}).subscribe({
      next: () => { this.showToast('Doctor approved — they can now log in', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to approve', 'error')
    });
  }

  rejectDoctor(id: string) {
    this.http.put<any>(`${this.api}/admin/users/${id}/reject`, {}).subscribe({
      next: () => { this.showToast('Doctor rejected/suspended', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to reject', 'error')
    });
  }

  deleteUser(id: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    this.http.delete<any>(`${this.api}/admin/users/${id}`).subscribe({
      next: () => { this.showToast('User deleted', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  deleteAppointment(id: string) {
    if (!confirm('Delete this appointment?')) return;
    this.http.delete<any>(`${this.api}/appointments/${id}`).subscribe({
      next: () => { this.showToast('Appointment deleted', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  deleteCommunityPost(id: string) {
    if (!confirm('Delete this post?')) return;
    this.http.delete<any>(`${this.api}/community/${id}`).subscribe({
      next: () => { this.showToast('Post deleted', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  // ── MEAL PLAN CRUD ──
  openMealForm(plan?: any) {
    if (plan) {
      this.editingMeal.set(plan);
      this.mealForm = { name: plan.name, description: plan.description, calories: plan.calories, protein: plan.protein, carbs: plan.carbs, fat: plan.fat, tags: (plan.tags || []).join(', '), imageUrl: plan.imageUrl || '' };
    } else {
      this.editingMeal.set(null);
      this.mealForm = { name: '', description: '', calories: 0, protein: 0, carbs: 0, fat: 0, tags: '', imageUrl: '' };
    }
    this.showMealForm.set(true);
  }

  saveMealPlan() {
    const payload = { ...this.mealForm, tags: this.mealForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) };
    const editing = this.editingMeal();
    const req = editing
      ? this.http.put<any>(`${this.api}/meal-plans/${editing._id || editing.id}`, payload)
      : this.http.post<any>(`${this.api}/meal-plans`, payload);
    req.subscribe({
      next: () => { this.showToast(editing ? 'Diet plan updated' : 'Diet plan created', 'success'); this.showMealForm.set(false); this.loadAll(); },
      error: () => this.showToast('Failed to save diet plan', 'error')
    });
  }

  deleteMealPlan(id: string) {
    if (!confirm('Delete this diet plan?')) return;
    this.http.delete<any>(`${this.api}/meal-plans/${id}`).subscribe({
      next: () => { this.showToast('Diet plan deleted', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  // ── WORKOUT PLAN CRUD ──
  openWorkoutForm(plan?: any) {
    if (plan) {
      this.editingWorkout.set(plan);
      this.workoutForm = { name: plan.name, description: plan.description, level: plan.level, duration: plan.duration, category: plan.category, caloriesBurn: plan.caloriesBurn, tags: (plan.tags || []).join(', '), imageUrl: plan.imageUrl || '' };
    } else {
      this.editingWorkout.set(null);
      this.workoutForm = { name: '', description: '', level: 'beginner', duration: 30, category: 'Strength', caloriesBurn: 0, tags: '', imageUrl: '' };
    }
    this.showWorkoutForm.set(true);
  }

  saveWorkoutPlan() {
    const payload = { ...this.workoutForm, tags: this.workoutForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) };
    const editing = this.editingWorkout();
    const req = editing
      ? this.http.put<any>(`${this.api}/workouts/${editing._id || editing.id}`, payload)
      : this.http.post<any>(`${this.api}/workouts`, payload);
    req.subscribe({
      next: () => { this.showToast(editing ? 'Workout plan updated' : 'Workout plan created', 'success'); this.showWorkoutForm.set(false); this.loadAll(); },
      error: () => this.showToast('Failed to save workout plan', 'error')
    });
  }

  deleteWorkoutPlan(id: string) {
    if (!confirm('Delete this workout plan?')) return;
    this.http.delete<any>(`${this.api}/workouts/${id}`).subscribe({
      next: () => { this.showToast('Workout plan deleted', 'success'); this.loadAll(); },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  filteredDoctors() {
    return this.allDoctors().filter(d => {
      const s = this.doctorSearch.toLowerCase();
      const matchSearch = !s || d.name.toLowerCase().includes(s) || d.email.toLowerCase().includes(s);
      const matchStatus = !this.doctorStatusFilter || (d.status || 'active') === this.doctorStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  filteredUsers() {
    const s = this.userSearch.toLowerCase();
    return this.allUsers().filter(u => !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toast.set(msg); this.toastType.set(type);
    setTimeout(() => this.toast.set(''), 3000);
  }

  rolePill(role: string) {
    const m: Record<string, string> = { user: 'bg-blue-100 text-blue-600', doctor: 'bg-green-100 text-green-600', admin: 'bg-purple-100 text-purple-600' };
    return m[role] || 'bg-gray-100 text-gray-500';
  }

  statusPill(status: string) {
    const m: Record<string, string> = { active: 'bg-green-100 text-green-600', pending: 'bg-orange-100 text-orange-600', rejected: 'bg-red-100 text-red-500' };
    return m[status] || 'bg-green-100 text-green-600';
  }

  apptPill(status: string) {
    const m: Record<string, string> = { confirmed: 'bg-green-100 text-green-600', pending: 'bg-orange-100 text-orange-600', completed: 'bg-blue-100 text-blue-600', cancelled: 'bg-red-100 text-red-500' };
    return m[status] || 'bg-gray-100 text-gray-500';
  }
}
