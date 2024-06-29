import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';
  type: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  login(): void {
    let data = {
      username: this.username,
      password: this.password
    };

    this.authService.login(data).subscribe((ans) => {
      localStorage.setItem('currentUser', JSON.stringify(ans));
      this.router.navigate(['/']); 
    });
  }
}
