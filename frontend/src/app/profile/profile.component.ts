import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  currentUser: User | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (!currentUserString) {
      this.router.navigate(['/']);
    } else {
      this.currentUser = JSON.parse(currentUserString);
    }
  }

  editProfile(): void {
    //this.router.navigate(['/profile-edit']);
  }
}
