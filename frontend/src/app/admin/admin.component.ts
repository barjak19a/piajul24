import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { UserService } from '../users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  currentUser!: User;
  guestUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.authService.checkUserType('admin')) {
      this.currentUser = this.authService.getCurrentUser();
    }
    this.collectGuestUsers();
  }

  collectGuestUsers(): void {
    this.userService.getGuestUsers({ approved: false }).subscribe(
      (users: User[]) => {
        this.guestUsers = users;
        console.log('Unapproved guest users:', this.guestUsers);
      },
      (error) => {
        console.error('Error fetching guest users:', error);
      }
    );
  }

  approveUser(user: User): void {
    // Implement the logic to approve a user
  }
  
  denyUser(user: User): void {
    // implement the logic to deny a user
  }
}
