import { Component } from '@angular/core';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username?: string;
  password?: string;
  safetyQuestion?: string;
  safetyAnswer?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  profilePicture?: string;
  creditCard?: string;

  message?: string;

  constructor(private registerService: RegisterService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.message = 'Invalid file type. Please select a JPG or PNG image.';
    }
  }

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
      creditCard: this.creditCard,
      profilePicture: this.profilePicture
    };

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
