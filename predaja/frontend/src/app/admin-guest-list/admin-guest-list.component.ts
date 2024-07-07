import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { UserService } from '../users.service';

@Component({
  selector: 'app-admin-guest-list',
  templateUrl: './admin-guest-list.component.html',
  styleUrls: ['./admin-guest-list.component.css']
})
export class AdminGuestListComponent {
  users: User[] = [];

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadGuestUsers();
  }

  loadGuestUsers(): void {
    this.userService.getUsersOfTypeGuest().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error fetching guest users:', error);
      }
    );
  }
}
