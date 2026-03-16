import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';
import { AuthService } from '../../services/auth.service';
import { CommunityPost } from '../../models/health.model';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Community</h1>
        <p class="text-gray-500 mt-1">Share your health journey and inspire others</p>
      </div>
      @if (auth.isLoggedIn()) {
        <div class="card mb-6">
          <div class="flex gap-3">
            <img [src]="auth.currentUser()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'" class="w-10 h-10 rounded-full flex-shrink-0">
            <div class="flex-1">
              <textarea [(ngModel)]="newPost" rows="3" placeholder="Share your health journey..."
                class="input-field resize-none"></textarea>
              <div class="flex justify-end mt-2">
                <button (click)="postContent()" [disabled]="!newPost.trim()" class="btn-primary text-sm py-2 px-5">Post</button>
              </div>
            </div>
          </div>
        </div>
      }
      <div class="space-y-4">
        @for (post of postsData(); track post.id) {
          <div class="card animate-fade-in">
            <div class="flex items-start gap-3 mb-3">
              <img [src]="post.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.userName" class="w-10 h-10 rounded-full">
              <div class="flex-1">
                <p class="font-semibold text-gray-900 text-sm">{{ post.userName }}</p>
                <p class="text-xs text-gray-400">{{ post.createdAt | date:'MMM d, h:mm a' }}</p>
              </div>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed mb-3">{{ post.content }}</p>
            <div class="flex flex-wrap gap-1 mb-3">
              @for (tag of post.tags; track tag) {
                <span class="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">#{{ tag }}</span>
              }
            </div>
            <div class="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button (click)="toggleLike(post.id)" class="flex items-center gap-1.5 text-sm transition-colors"
                [class]="post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'">
                <i class="fas fa-heart"></i>
                <span>{{ post.likes }}</span>
              </button>
              <button class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 transition-colors">
                <i class="fas fa-comment"></i>
                <span>{{ post.comments.length }} comments</span>
              </button>
              <button class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 transition-colors ml-auto">
                <i class="fas fa-share"></i> Share
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CommunityComponent implements OnInit {
  newPost = '';
  postsData = signal<CommunityPost[]>([]);

  constructor(public health: HealthService, public auth: AuthService) {}

  ngOnInit(): void {
    this.health.getCommunityPosts().subscribe((posts: CommunityPost[]) => this.postsData.set(posts));
  }

  toggleLike(postId: string): void {
    this.health.toggleLike(postId).subscribe({
      next: (res: { likes: number }) => {
        this.postsData.update((posts: CommunityPost[]) =>
          posts.map((p: CommunityPost) => p.id === postId ? { ...p, likes: res.likes, liked: !p.liked } : p)
        );
      },
      error: () => {
        this.postsData.update((posts: CommunityPost[]) =>
          posts.map((p: CommunityPost) => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
        );
      }
    });
  }

  postContent(): void {
    if (!this.newPost.trim() || !this.auth.currentUser()) return;
    const user = this.auth.currentUser()!;
    const postData: Partial<CommunityPost> = {
      userId: user.id, userName: user.name,
      userAvatar: user.avatar, content: this.newPost,
      likes: 0, comments: [], tags: [], createdAt: new Date()
    };
    this.health.createCommunityPost(postData).subscribe({
      next: (post: CommunityPost) => {
        this.postsData.update((p: CommunityPost[]) => [post, ...p]);
        this.newPost = '';
      }
    });
  }
}