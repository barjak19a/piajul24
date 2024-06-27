import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username?: string;
  // TODO: Lozinku cuvati kao kriptovanu
  password?: string;
  safetyQuestion?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  adress?: string;
  mobilePhone?: string;
  email?: string;
  //profilePicture?: File;
  creditCard?: string;

  message?: string;

  register(): void {}
}
