import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../users.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-admin-login',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  adminUsername?: string;
  adminPassword?: string;
  message?: string;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  adminlogin(): void {
    const credentials = {
      username: this.adminUsername,
      password: this.adminPassword
    };

    this.authService.adminlogin(credentials).subscribe(
      (response) => {
        console.log('Login successful!', response);
        this.message = 'Login successful!';

        this.userService.setCurrentUser(response as User);
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error('Error during login:', error);
        this.message = 'Error during login. Please try again.';
      }
    );
  }
}
