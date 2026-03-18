import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';
import { BlogPost } from '../../models/health.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Health Blog</h1>
        <p class="text-gray-500 mt-1 text-sm sm:text-base">Expert insights and tips for a healthier life</p>
      </div>

      <div class="flex gap-2 mb-5 sm:mb-6 flex-wrap">
        @for (cat of categories; track cat) {
          <button (click)="activeCategory.set(cat)"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
            [class]="activeCategory() === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'">
            {{ cat }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        @for (post of filteredPosts(); track post.id) {
          <div class="card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-pointer" (click)="selected.set(post)">
            <img [src]="post.imageUrl" [alt]="post.title" class="w-full h-48 object-cover">
            <div class="p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="badge badge-blue">{{ post.category }}</span>
                <span class="text-xs text-gray-400"><i class="fas fa-clock mr-1"></i>{{ post.readTime }} min read</span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{{ post.title }}</h3>
              <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ post.excerpt }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.author" class="w-7 h-7 rounded-full">
                  <span class="text-xs text-gray-600 font-medium">{{ post.author }}</span>
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <span><i class="fas fa-heart mr-1 text-red-400"></i>{{ post.likes }}</span>
                  <span><i class="fas fa-comment mr-1 text-blue-400"></i>{{ post.comments }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      @if (selected()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selected.set(null)">
          <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up" (click)="$event.stopPropagation()">
            <img [src]="selected()!.imageUrl" class="w-full h-56 object-cover rounded-t-2xl">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span class="badge badge-blue">{{ selected()!.category }}</span>
                <button (click)="selected.set(null)" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ selected()!.title }}</h2>
              <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selected()!.author" class="w-9 h-9 rounded-full">
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ selected()!.author }}</p>
                  <p class="text-xs text-gray-400">{{ selected()!.publishedAt | date:'MMMM d, y' }} · {{ selected()!.readTime }} min read</p>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed">{{ selected()!.excerpt }}</p>
              <p class="text-gray-600 leading-relaxed mt-4">This is a comprehensive article about {{ selected()!.title.toLowerCase() }}. Our expert authors provide evidence-based insights to help you make informed decisions about your health and wellness journey.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BlogComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  activeCategory = signal('All');
  selected = signal<BlogPost | null>(null);
  categories = ['All', 'Sleep', 'Nutrition', 'Mental Health', 'Fitness'];

  constructor(private health: HealthService) {}

  ngOnInit() {
    this.health.getBlogPosts().subscribe((posts: BlogPost[]) => this.posts.set(posts));
  }

  filteredPosts() {
    const cat = this.activeCategory();
    if (cat === 'All') return this.posts();
    return this.posts().filter(p => p.category === cat);
  }
}
