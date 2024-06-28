import { Component } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  adminUsername?: string;
  adminPassword?: string;
  message?: string;

  constructor(private loginservice: LoginService) {}

  adminlogin(): void {
    const credentials = {
      username: this.adminUsername,
      password: this.adminPassword
    };

    this.loginservice.adminlogin(credentials).subscribe(
      (response) => {
        console.log('Login successful!', response);
        this.message = 'Login successful!';
      },
      (error) => {
        console.error('Error during login:', error);
        this.message = 'Error during login. Please try again.';
      }
    );
  }
}
