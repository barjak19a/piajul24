import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    // Implement logic to check if user is logged in
    return localStorage.getItem('currentUser') !== null;
  }

  logout(): void {
    // Remove user object from localStorage
    localStorage.removeItem('currentUser');
    // Redirect to home page or any desired route
    this.router.navigate(['/']);
  }
}
