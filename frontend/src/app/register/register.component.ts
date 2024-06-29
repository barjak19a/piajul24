import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  safetyQuestion: string = '';
  safetyAnswer: string = '';
  firstName: string = '';
  lastName: string = '';
  gender: string = '';
  address: string = '';
  phoneNumber: string = '';
  email: string = '';
  profilePicture: string = '';
  creditCard: string = '';
  
  message: string = '';
  

  constructor(private authService: AuthService) {}

  // TODO: check if photo is in 100x100 to 300x300 dimensions range 
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      this.message = 'No file selected';
      return;
    }

    if (!(file.type === 'image/jpeg' || file.type === 'image/png'))
    {
      this.message = 'Invalid file type. Please select a JPG or PNG image.';
      return;
    }

    const img = new Image();
    const self = this;
    img.onload = function() {
        const width = img.width;
        const height = img.height;

        if (width >= 100 && width <= 300 && height >= 100 && height <= 300) {
            self.profilePicture = img.src as string;
        } else {
            self.message = 'Photo must be at least 100x100 pixels and not larger than 300x300 pixels';
        }
    };

    img.onerror = function() {
      self.message = 'Invalid image file';
    };

    const reader = new FileReader();
    reader.onload = function(e: any) {
      img.src = e.target.result;
  };

    reader.readAsDataURL(file);
  }

  validateRequiredFields(): boolean {
    if (!this.username) {
      this.message = 'Username cannot be empty.';
      return false;
    }
    if (!this.password) {
      this.message = 'Password cannot be empty.';
      return false;
    }
    if (!this.safetyQuestion) {
      this.message = 'Safety question cannot be empty.';
      return false;
    }
    if (!this.safetyAnswer) {
      this.message = 'Safety answer cannot be empty.';
      return false;
    }
    if (!this.firstName) {
      this.message = 'First name cannot be empty.';
      return false;
    }
    if (!this.lastName) {
      this.message = 'Last name cannot be empty.';
      return false;
    }
    if (!this.gender) {
      this.message = 'Gender cannot be empty.';
      return false;
    }
    if (!this.address) {
      this.message = 'Address cannot be empty.';
      return false;
    }
    if (!this.phoneNumber) {
      this.message = 'Phone number cannot be empty.';
      return false;
    }
    if (!this.email) {
      this.message = 'Email cannot be empty.';
      return false;
    }
    if (!this.creditCard) {
      this.message = 'Credit card cannot be empty.';
      return false;
    }
    if (!this.profilePicture) {
      this.message = 'Profile picture cannot be empty.';
      return false;
    }
  
    return true;
  }
  
  validate(): boolean {
      // Validate phone number contains only digits
      if (!/^\d+$/.test(this.phoneNumber)) {
        this.message = 'Phone number should contain only digits.';
        return false;
      }
  
      // Validate credit card number contains only digits
      if (!/^\d+$/.test(this.creditCard)) {
        this.message = 'Credit card number should contain only digits.';
        return false;
      }
  
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.message = 'Invalid email format.';
        return false;
      }
  
      const password = this.password 
      // Check length between 6 and 10 characters
      if (password.length < 6 || password.length > 10) {
        this.message = 'Password must be between 6 and 10 characters.';
        return false;
      }

      // Check if password starts with a letter
      if (!/^[A-Za-z]/.test(password)) {
        this.message = 'Password must start with a letter.';
        return false;
      }

      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        this.message = 'Password must contain at least one uppercase letter.';
        return false;
      }

      // Check for at least three lowercase letters
      if ((password.match(/[a-z]/g) || []).length < 3) {
        this.message = 'Password must contain at least three lowercase letters.';
        return false;
      }

      // Check for at least one digit
      if (!/\d/.test(password)) {
        this.message = 'Password must contain at least one digit.';
        return false;
      }

      // Check for at least one special character
      if (!/[!@#$%^&*()]/.test(password)) {
        this.message = 'Password must contain at least one special character (e.g., !@#$%^&*()).';
        return false;
      }

    return true;
  }

  register(): void {
    if(!this.validateRequiredFields() || !this.validate())
      return;

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
      profilePicture: this.profilePicture,
      role: 'guest'
    };

    this.authService.register(formData).subscribe(
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
