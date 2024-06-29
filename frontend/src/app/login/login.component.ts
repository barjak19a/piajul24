import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  username?: string;
  password?: string;
  type?: string;
  message?: string;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    
  }

  login(): void {
    let data = {
      username: this.username,
      password: this.password
    };

    this.loginService.login(data).subscribe((ans) => {
      console.log(ans);
      // TODO: Rutiraj se na profilnu stranicu
      localStorage.setItem('currentUser', JSON.stringify(ans));
      this.router.navigate(['/change-password']); 
    });
  }

}
