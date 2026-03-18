import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  template: `
    @if (isIsolatedRoute()) {
      <router-outlet></router-outlet>
    } @else {
      <div class="min-h-screen flex flex-col">
        <app-navbar></app-navbar>
        <main class="flex-1">
          <router-outlet></router-outlet>
        </main>
        <app-footer></app-footer>
      </div>
    }
  `
})
export class AppComponent {
  isIsolatedRoute = signal(false);

  // Patient sidebar routes (isolated — no navbar/footer)
  private patientRoutes = [
    '/dashboard', '/health-tracking', '/meal-plans', '/workouts',
    '/appointments', '/community',
    '/progress', '/profile'
  ];

  constructor(private router: Router, public auth: AuthService) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects;
      const isPatient = this.patientRoutes.some(r => url.startsWith(r));
      this.isIsolatedRoute.set(
        url.startsWith('/admin') || url.startsWith('/doctor-portal') || isPatient
      );
    });
  }
}
