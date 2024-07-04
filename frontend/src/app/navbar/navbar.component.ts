import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../auth.service';
import { UserService } from '../users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: User | null = null;
  
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.userService.setCurrentUser(null);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isGuest(): boolean {
    return this.currentUser?.role === 'guest';
  }
}
