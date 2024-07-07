import { Component } from '@angular/core';
import { UserService } from '../users.service';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  currentUser: User | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (!currentUserString) {
      this.router.navigate(['/']);
    } else {
      this.currentUser = JSON.parse(currentUserString);
    }
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    const username = this.currentUser?.username;

    this.userService.changePassword(username || '', this.currentPassword, this.newPassword).subscribe(
      (response) => {
        console.log('Password change successful!', response);
        this.message = 'Password change successful!';
      },
      (error) => {
        console.error('Error changing password:', error);
        this.message = 'Error changing password. Please try again.';
      }
    );
  }
}
