import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthLog, MealPlan, WorkoutPlan, Appointment, BlogPost, CommunityPost } from '../models/health.model';
import { environment } from '../../environments/environment';

interface ApiList<T> { success: boolean; data: T[]; }
interface ApiItem<T> { success: boolean; data: T; }

@Injectable({ providedIn: 'root' })
export class HealthService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLogs(): Observable<HealthLog[]> {
    return this.http.get<ApiList<HealthLog>>(`${this.api}/health-logs`).pipe(
      map(r => r.data), catchError(() => of([]))
    );
  }
  addLog(log: Partial<HealthLog>): Observable<HealthLog> {
    return this.http.post<ApiItem<HealthLog>>(`${this.api}/health-logs`, log).pipe(map(r => r.data));
  }
  updateLog(id: string, log: Partial<HealthLog>): Observable<HealthLog> {
    return this.http.put<ApiItem<HealthLog>>(`${this.api}/health-logs/${id}`, log).pipe(map(r => r.data));
  }
  deleteLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/health-logs/${id}`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<ApiList<Appointment>>(`${this.api}/appointments`).pipe(
      map(r => r.data), catchError(() => of([]))
    );
  }
  createAppointment(appt: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<ApiItem<Appointment>>(`${this.api}/appointments`, appt).pipe(map(r => r.data));
  }
  updateAppointment(id: string, appt: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<ApiItem<Appointment>>(`${this.api}/appointments/${id}`, appt).pipe(map(r => r.data));
  }
  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/appointments/${id}`);
  }

  getDoctors(params?: { specialty?: string; search?: string }): Observable<any[]> {
    let query = '';
    if (params?.specialty) query += `specialty=${encodeURIComponent(params.specialty)}&`;
    if (params?.search) query += `search=${encodeURIComponent(params.search)}`;
    const url = `${this.api}/doctors${query ? '?' + query : ''}`;
    return this.http.get<ApiList<any>>(url).pipe(
      map(r => r.data), catchError(() => of(this.mockDoctors()))
    );
  }

  getMealPlans(): Observable<MealPlan[]> {
    return this.http.get<ApiList<MealPlan>>(`${this.api}/meal-plans`).pipe(
      map(r => r.data), catchError(() => of(this.mockMealPlans()))
    );
  }

  getWorkoutPlans(): Observable<WorkoutPlan[]> {
    return this.http.get<ApiList<WorkoutPlan>>(`${this.api}/workouts`).pipe(
      map(r => r.data), catchError(() => of(this.mockWorkouts()))
    );
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<ApiList<BlogPost>>(`${this.api}/blog`).pipe(
      map(r => r.data), catchError(() => of(this.mockBlogPosts()))
    );
  }
  createBlogPost(post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<ApiItem<BlogPost>>(`${this.api}/blog`, post).pipe(map(r => r.data));
  }

  getCommunityPosts(): Observable<CommunityPost[]> {
    return this.http.get<ApiList<CommunityPost>>(`${this.api}/community`).pipe(
      map(r => r.data), catchError(() => of(this.mockCommunityPosts()))
    );
  }
  createCommunityPost(post: Partial<CommunityPost>): Observable<CommunityPost> {
    return this.http.post<ApiItem<CommunityPost>>(`${this.api}/community`, post).pipe(map(r => r.data));
  }
  toggleLike(postId: string): Observable<{ likes: number }> {
    return this.http.post<ApiItem<{ likes: number }>>(`${this.api}/community/${postId}/like`, {}).pipe(
      map(r => r.data)
    );
  }

  private mockDoctors(): any[] {
    return [
      { id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'General Physician', experience: 12, rating: 4.9, reviewCount: 234, consultationFee: 80, bio: 'Experienced GP focused on preventive care.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', availability: ['Mon', 'Wed', 'Fri'], hospital: 'City Medical Center' },
      { id: 'd2', name: 'Dr. James Carter', specialty: 'Cardiologist', experience: 18, rating: 4.8, reviewCount: 189, consultationFee: 150, bio: 'Board-certified cardiologist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', availability: ['Tue', 'Thu'], hospital: 'Heart Institute' },
      { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Nutritionist', experience: 8, rating: 4.7, reviewCount: 156, consultationFee: 90, bio: 'Clinical nutritionist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', availability: ['Mon', 'Tue', 'Thu', 'Fri'], hospital: 'Wellness Clinic' },
      { id: 'd4', name: 'Dr. Robert Kim', specialty: 'Psychiatrist', experience: 15, rating: 4.9, reviewCount: 201, consultationFee: 120, bio: 'Compassionate psychiatrist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', availability: ['Wed', 'Thu', 'Fri'], hospital: 'Mind & Body Clinic' },
    ];
  }
  private mockMealPlans(): MealPlan[] {
    return [
      { id: 'm1', name: 'Mediterranean Diet', description: 'Heart-healthy eating', calories: 1800, protein: 90, carbs: 220, fat: 65, meals: [], tags: ['heart-healthy', 'balanced', 'anti-inflammatory'], imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
      { id: 'm2', name: 'High Protein Plan', description: 'Muscle building diet', calories: 2200, protein: 180, carbs: 200, fat: 70, meals: [], tags: ['muscle-gain', 'high-protein', 'fitness'], imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400' },
      { id: 'm3', name: 'Weight Loss Plan', description: 'Calorie-controlled plan', calories: 1400, protein: 100, carbs: 150, fat: 45, meals: [], tags: ['weight-loss', 'low-calorie', 'balanced'], imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400' },
      { id: 'm4', name: 'Plant-Based Diet', description: 'Nutrient-rich vegan plan', calories: 1700, protein: 75, carbs: 250, fat: 55, meals: [], tags: ['vegan', 'plant-based', 'sustainable'], imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
    ];
  }
  private mockWorkouts(): WorkoutPlan[] {
    return [
      { id: 'w1', name: 'Full Body Blast', description: 'Complete full-body workout', level: 'beginner', duration: 45, category: 'Strength', exercises: [], tags: ['full-body', 'strength'], imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', caloriesBurn: 350 },
      { id: 'w2', name: 'HIIT Cardio', description: 'High-intensity interval training', level: 'intermediate', duration: 30, category: 'Cardio', exercises: [], tags: ['hiit', 'cardio'], imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', caloriesBurn: 450 },
      { id: 'w3', name: 'Yoga Flow', description: 'Relaxing yoga session', level: 'beginner', duration: 60, category: 'Flexibility', exercises: [], tags: ['yoga', 'flexibility'], imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', caloriesBurn: 200 },
      { id: 'w4', name: 'Advanced Strength', description: 'Heavy lifting program', level: 'advanced', duration: 75, category: 'Strength', exercises: [], tags: ['strength', 'advanced'], imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', caloriesBurn: 500 },
    ];
  }
  private mockBlogPosts(): BlogPost[] {
    return [
      { id: 'b1', title: '10 Science-Backed Ways to Improve Your Sleep', excerpt: 'Quality sleep is the foundation of good health.', content: '', author: 'Dr. Sarah Mitchell', category: 'Sleep', tags: ['sleep', 'wellness'], imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', publishedAt: new Date('2024-12-01'), readTime: 8, likes: 234, comments: 45 },
      { id: 'b2', title: 'The Ultimate Guide to Intermittent Fasting', excerpt: 'Everything you need to know about IF.', content: '', author: 'Dr. James Carter', category: 'Nutrition', tags: ['fasting', 'nutrition'], imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', publishedAt: new Date('2024-11-28'), readTime: 12, likes: 189, comments: 67 },
      { id: 'b3', title: 'Mental Health in the Digital Age', excerpt: 'How to maintain psychological wellbeing.', content: '', author: 'Dr. Emily Chen', category: 'Mental Health', tags: ['mental-health'], imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', publishedAt: new Date('2024-11-20'), readTime: 10, likes: 312, comments: 89 },
      { id: 'b4', title: 'Building Sustainable Fitness Habits', excerpt: 'Learn how to build exercise habits that stick.', content: '', author: 'Coach Mike Torres', category: 'Fitness', tags: ['fitness'], imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', publishedAt: new Date('2024-11-15'), readTime: 7, likes: 156, comments: 34 },
    ];
  }
  private mockCommunityPosts(): CommunityPost[] {
    return [
      { id: 'p1', userId: '2', userName: 'Maria G.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', content: 'Just completed my first 5K run!', likes: 42, comments: [], tags: ['running', 'fitness'], createdAt: new Date(Date.now() - 3600000), liked: false },
      { id: 'p2', userId: '3', userName: 'Tom B.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', content: 'Meal prepped for the whole week!', likes: 28, comments: [], tags: ['nutrition'], createdAt: new Date(Date.now() - 7200000), liked: false },
      { id: 'p3', userId: '4', userName: 'Lisa K.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', content: '30 days of meditation complete!', likes: 65, comments: [], tags: ['mentalhealth'], createdAt: new Date(Date.now() - 10800000), liked: false },
    ];
  }
}
