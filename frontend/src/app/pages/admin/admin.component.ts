import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

type Tab = 'overview' | 'pending' | 'doctors' | 'users' | 'appointments' | 'blog' | 'community';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex h-screen bg-gray-950 overflow-hidden">

  <!-- ── SIDEBAR ── -->
  <aside class="w-64 flex-shrink-0 bg-gray-900 flex flex-col border-r border-gray-800"
    [class.hidden]="!sidebarOpen() && isMobile()">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
      <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
        <i class="fas fa-shield-alt text-white text-sm"></i>
      </div>
      <div>
        <p class="text-white font-bold text-sm leading-tight">Health Care System</p>
        <p class="text-gray-400 text-xs">Admin Console</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      @for (item of navItems; track item.id) {
        <button (click)="activeTab.set(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          [class]="activeTab() === item.id
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'">
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
    <div class="px-3 py-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-3 py-2 mb-2">
        <img [src]="auth.currentUser()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'"
          class="w-8 h-8 rounded-full">
        <div class="flex-1 min-w-0">
          <p class="text-white text-xs font-semibold truncate">{{ auth.currentUser()?.name }}</p>
          <p class="text-gray-500 text-xs">Administrator</p>
        </div>
      </div>
      <button (click)="logout()"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 transition-all">
        <i class="fas fa-sign-out-alt w-4 text-center"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- ── MAIN CONTENT ── -->
  <div class="flex-1 flex flex-col overflow-hidden">

    <!-- Top bar -->
    <header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-4">
        <button (click)="sidebarOpen.set(!sidebarOpen())" class="text-gray-400 hover:text-white md:hidden">
          <i class="fas fa-bars"></i>
        </button>
        <div>
          <h1 class="text-white font-bold text-lg">{{ currentTabLabel() }}</h1>
          <p class="text-gray-500 text-xs">HealthCare+ Admin Panel</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button (click)="loadAll()" class="text-gray-400 hover:text-white transition-colors" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
        <div class="w-px h-6 bg-gray-700"></div>
        <span class="text-xs text-gray-400">{{ today }}</span>
      </div>
    </header>

    <!-- Scrollable content -->
    <main class="flex-1 overflow-y-auto bg-gray-950 p-6">

      <!-- ── OVERVIEW ── -->
      @if (activeTab() === 'overview') {
        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          @for (s of stats(); track s.label) {
            <div class="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" [class]="s.bg">
                <i [class]="s.icon + ' ' + s.color"></i>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ s.value }}</p>
                <p class="text-xs text-gray-500">{{ s.label }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Pending alert -->
        @if (pendingDoctors().length > 0) {
          <div class="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-clock text-orange-400 text-xl"></i>
              <div>
                <p class="text-white font-semibold">{{ pendingDoctors().length }} doctor(s) awaiting approval</p>
                <p class="text-gray-400 text-sm">Review and approve or reject their applications</p>
              </div>
            </div>
            <button (click)="activeTab.set('pending')" class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Review Now
            </button>
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent users -->
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 class="text-white font-bold mb-4">Recent Registrations</h3>
            <div class="space-y-3">
              @for (u of allUsers().concat(allDoctors()).slice(0,6); track u.id) {
                <div class="flex items-center gap-3">
                  <img [src]="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+u.name" class="w-9 h-9 rounded-full">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate">{{ u.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ u.email }}</p>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="rolePill(u.role)">{{ u.role }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="statusPill(u.status)">{{ u.status || 'active' }}</span>
                </div>
              }
            </div>
          </div>
          <!-- Quick stats -->
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 class="text-white font-bold mb-4">Platform Health</h3>
            <div class="space-y-4">
              @for (m of systemMetrics; track m.label) {
                <div>
                  <div class="flex justify-between text-sm mb-1.5">
                    <span class="text-gray-400">{{ m.label }}</span>
                    <span class="font-bold text-white">{{ m.value }}%</span>
                  </div>
                  <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
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
          <div class="bg-gray-900 rounded-2xl border border-gray-800 p-16 text-center">
            <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
            <p class="text-xl font-bold text-white">All caught up!</p>
            <p class="text-gray-500 mt-1">No pending doctor approvals</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            @for (doc of pendingDoctors(); track doc.id) {
              <div class="bg-gray-900 rounded-2xl border border-orange-500/30 p-5">
                <div class="flex items-start gap-3 mb-4">
                  <img [src]="doc.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+doc.name" class="w-12 h-12 rounded-xl">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-white truncate">{{ doc.name }}</p>
                    <p class="text-sm text-primary-400">{{ doc.specialty || 'No specialty' }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ doc.email }}</p>
                  </div>
                  <span class="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">Pending</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center mb-4">
                  <div class="bg-gray-800 rounded-xl p-2">
                    <p class="font-bold text-white text-sm">{{ doc.experience || '—' }}</p>
                    <p class="text-xs text-gray-500">Yrs</p>
                  </div>
                  <div class="bg-gray-800 rounded-xl p-2">
                    <p class="font-bold text-white text-sm">\${{ doc.consultationFee || '—' }}</p>
                    <p class="text-xs text-gray-500">Fee</p>
                  </div>
                  <div class="bg-gray-800 rounded-xl p-2">
                    <p class="font-bold text-white text-xs truncate">{{ doc.hospital || '—' }}</p>
                    <p class="text-xs text-gray-500">Hospital</p>
                  </div>
                </div>
                @if (doc.bio) {
                  <p class="text-xs text-gray-400 mb-4 line-clamp-2">{{ doc.bio }}</p>
                }
                <div class="flex gap-2">
                  <button (click)="approveDoctor(doc.id)"
                    class="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
                    <i class="fas fa-check mr-1"></i>Approve
                  </button>
                  <button (click)="rejectDoctor(doc.id)"
                    class="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
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
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <input type="text" [(ngModel)]="doctorSearch" placeholder="Search doctors..."
            class="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500">
          <select [(ngModel)]="doctorStatusFilter"
            class="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 sm:w-40">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Doctor</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Specialty</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Hospital</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of filteredDoctors(); track doc.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <img [src]="doc.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+doc.name" class="w-8 h-8 rounded-full">
                      <div>
                        <p class="font-semibold text-white text-sm">{{ doc.name }}</p>
                        <p class="text-xs text-gray-500">{{ doc.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-400 hidden md:table-cell">{{ doc.specialty || '—' }}</td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">{{ doc.hospital || '—' }}</td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="statusPill(doc.status)">{{ doc.status || 'active' }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-1 flex-wrap">
                      @if (doc.status === 'pending' || doc.status === 'rejected') {
                        <button (click)="approveDoctor(doc.id)" class="text-xs bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Approve</button>
                      }
                      @if (doc.status === 'active' || doc.status === 'pending') {
                        <button (click)="rejectDoctor(doc.id)" class="text-xs bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-lg transition-colors">
                          {{ doc.status === 'active' ? 'Suspend' : 'Reject' }}
                        </button>
                      }
                      <button (click)="deleteUser(doc.id)" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredDoctors().length === 0) {
            <p class="text-center text-gray-600 py-10">No doctors found</p>
          }
        </div>
      }

      <!-- ── USERS ── -->
      @if (activeTab() === 'users') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 mb-4">
          <input type="text" [(ngModel)]="userSearch" placeholder="Search users by name or email..."
            class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500">
        </div>
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Joined</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (u of filteredUsers(); track u.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <img [src]="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+u.name" class="w-8 h-8 rounded-full">
                      <div>
                        <p class="font-semibold text-white text-sm">{{ u.name }}</p>
                        <p class="text-xs text-gray-500">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{{ u.createdAt | date:'MMM d, y' }}</td>
                  <td class="py-3 px-4">
                    <button (click)="deleteUser(u.id)" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg transition-colors">
                      <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (filteredUsers().length === 0) {
            <p class="text-center text-gray-600 py-10">No users found</p>
          }
        </div>
      }

      <!-- ── APPOINTMENTS ── -->
      @if (activeTab() === 'appointments') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 class="text-white font-bold">All Appointments</h3>
            <span class="text-sm text-gray-500">{{ appointments().length }} total</span>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800">
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Doctor</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Date & Time</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Type</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th class="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (appt of appointments(); track appt.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td class="py-3 px-4 text-white font-medium">{{ appt.doctorName }}</td>
                  <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{{ appt.date | date:'MMM d, y' }} · {{ appt.time }}</td>
                  <td class="py-3 px-4 hidden sm:table-cell">
                    <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{{ appt.type }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="apptPill(appt.status)">{{ appt.status }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <button (click)="deleteAppointment(appt.id)" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (appointments().length === 0) {
            <p class="text-center text-gray-600 py-10">No appointments yet</p>
          }
        </div>
      }

      <!-- ── BLOG ── -->
      @if (activeTab() === 'blog') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 class="text-white font-bold">Blog Posts</h3>
            <span class="text-sm text-gray-500">{{ blogPosts().length }} posts</span>
          </div>
          <div class="divide-y divide-gray-800">
            @for (post of blogPosts(); track post.id) {
              <div class="flex items-center gap-4 p-4 hover:bg-gray-800/40 transition-colors">
                <img [src]="post.imageUrl" class="w-14 h-14 rounded-xl object-cover flex-shrink-0">
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold text-sm truncate">{{ post.title }}</p>
                  <p class="text-gray-500 text-xs">{{ post.authorName }} · {{ post.category }}</p>
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-500 hidden sm:flex">
                  <span><i class="fas fa-heart mr-1 text-red-400"></i>{{ post.likes }}</span>
                </div>
                <button (click)="deleteBlogPost(post._id || post.id)" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors flex-shrink-0">Delete</button>
              </div>
            }
            @if (blogPosts().length === 0) {
              <p class="text-center text-gray-600 py-10">No blog posts</p>
            }
          </div>
        </div>
      }

      <!-- ── COMMUNITY ── -->
      @if (activeTab() === 'community') {
        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 class="text-white font-bold">Community Posts</h3>
            <span class="text-sm text-gray-500">{{ communityPosts().length }} posts</span>
          </div>
          <div class="divide-y divide-gray-800">
            @for (post of communityPosts(); track post.id) {
              <div class="flex items-start gap-4 p-4 hover:bg-gray-800/40 transition-colors">
                <img [src]="post.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+post.userName" class="w-9 h-9 rounded-full flex-shrink-0">
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold text-sm">{{ post.userName }}</p>
                  <p class="text-gray-400 text-sm mt-0.5 line-clamp-2">{{ post.content }}</p>
                  <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span><i class="fas fa-heart mr-1 text-red-400"></i>{{ post.likes }}</span>
                    <span>{{ post.createdAt | date:'MMM d, y' }}</span>
                  </div>
                </div>
                <button (click)="deleteCommunityPost(post._id || post.id)" class="text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-colors flex-shrink-0">Delete</button>
              </div>
            }
            @if (communityPosts().length === 0) {
              <p class="text-center text-gray-600 py-10">No community posts</p>
            }
          </div>
        </div>
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
  sidebarOpen = signal(true);
  isMobile = signal(window.innerWidth < 768);

  stats = signal<any[]>([
    { label: 'Total Patients', value: '—', icon: 'fas fa-users', bg: 'bg-blue-500/20', color: 'text-blue-400' },
    { label: 'Active Doctors', value: '—', icon: 'fas fa-user-md', bg: 'bg-green-500/20', color: 'text-green-400' },
    { label: 'Appointments', value: '—', icon: 'fas fa-calendar', bg: 'bg-purple-500/20', color: 'text-purple-400' },
    { label: 'Blog Posts', value: '—', icon: 'fas fa-newspaper', bg: 'bg-orange-500/20', color: 'text-orange-400' },
  ]);

  pendingDoctors = signal<any[]>([]);
  allDoctors = signal<any[]>([]);
  allUsers = signal<any[]>([]);
  appointments = signal<any[]>([]);
  blogPosts = signal<any[]>([]);
  communityPosts = signal<any[]>([]);
  toast = signal('');
  toastType = signal<'success' | 'error'>('success');

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
    { id: 'blog' as Tab, label: 'Blog Posts', icon: 'fas fa-newspaper' },
    { id: 'community' as Tab, label: 'Community', icon: 'fas fa-comments' },
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

  loadAll() {
    this.http.get<any>(`${this.api}/admin/stats`).subscribe({ next: res => {
      const d = res.data;
      this.stats.set([
        { label: 'Total Patients', value: String(d.totalUsers), icon: 'fas fa-users', bg: 'bg-blue-500/20', color: 'text-blue-400' },
        { label: 'Active Doctors', value: String(d.totalDoctors), icon: 'fas fa-user-md', bg: 'bg-green-500/20', color: 'text-green-400' },
        { label: 'Appointments', value: String(d.totalAppointments), icon: 'fas fa-calendar', bg: 'bg-purple-500/20', color: 'text-purple-400' },
        { label: 'Blog Posts', value: String(d.totalPosts), icon: 'fas fa-newspaper', bg: 'bg-orange-500/20', color: 'text-orange-400' },
      ]);
    }});
    this.http.get<any>(`${this.api}/admin/pending-doctors`).subscribe({ next: res => this.pendingDoctors.set(res.data) });
    this.http.get<any>(`${this.api}/admin/users`).subscribe({ next: res => {
      this.allUsers.set(res.data.filter((u: any) => u.role === 'user'));
      this.allDoctors.set(res.data.filter((u: any) => u.role === 'doctor'));
    }});
    this.http.get<any>(`${this.api}/appointments`).subscribe({ next: res => this.appointments.set(res.data || []), error: () => {} });
    this.http.get<any>(`${this.api}/blog`).subscribe({ next: res => this.blogPosts.set(res.data || []), error: () => {} });
    this.http.get<any>(`${this.api}/community`).subscribe({ next: res => this.communityPosts.set(res.data || []), error: () => {} });
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

  deleteBlogPost(id: string) {
    if (!confirm('Delete this blog post?')) return;
    this.http.delete<any>(`${this.api}/blog/${id}`).subscribe({
      next: () => { this.showToast('Blog post deleted', 'success'); this.loadAll(); },
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
    const m: Record<string, string> = { user: 'bg-blue-500/20 text-blue-400', doctor: 'bg-green-500/20 text-green-400', admin: 'bg-purple-500/20 text-purple-400' };
    return m[role] || 'bg-gray-500/20 text-gray-400';
  }

  statusPill(status: string) {
    const m: Record<string, string> = { active: 'bg-green-500/20 text-green-400', pending: 'bg-orange-500/20 text-orange-400', rejected: 'bg-red-500/20 text-red-400' };
    return m[status] || 'bg-green-500/20 text-green-400';
  }

  apptPill(status: string) {
    const m: Record<string, string> = { confirmed: 'bg-green-500/20 text-green-400', pending: 'bg-orange-500/20 text-orange-400', completed: 'bg-blue-500/20 text-blue-400', cancelled: 'bg-red-500/20 text-red-400' };
    return m[status] || 'bg-gray-500/20 text-gray-400';
  }
}
