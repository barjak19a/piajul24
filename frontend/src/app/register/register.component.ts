import { Component } from '@angular/core';
import { RegisterService } from '../register.service';

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
  safetyAnswer?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  //profilePicture?: File;
  creditCard?: string;

  message?: string;

  constructor(private registerService: RegisterService) {}

  register(): void {
    const formData = {
      username: this.username,
      password: this.password,
      safetyQuestion: this.safetyQuestion,
      safetyAnswer: this.safetyAnswer,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
      creditCard: this.creditCard
    };

    // Call the register method from the service and handle the response
    this.registerService.register(formData).subscribe(
      (response) => {
        console.log('Registration successful!', response);
        this.message = 'Registration successful!';
      },
      (error) => {
        console.error('Error during registration:', error);
        this.message = 'Error during registration. Please try again.';
      }
    );
  }
}
