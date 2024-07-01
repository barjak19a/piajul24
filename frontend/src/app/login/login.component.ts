import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../model/user.model';

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
  currentUser!: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  login(): void {
    let data = {
      username: this.username,
      password: this.password
    };

    this.authService.login(data).subscribe((ans) => {
      localStorage.setItem('currentUser', JSON.stringify(ans));

      this.currentUser = ans as User;

      if (this.currentUser.role == 'guest')
        this.router.navigate(['/']);
      else if (this.currentUser.role == 'waiter')
        this.router.navigate(['/waiter']);
    });
  }
}
