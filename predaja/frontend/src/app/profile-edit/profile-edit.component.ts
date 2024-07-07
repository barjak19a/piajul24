import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { UserService } from '../users.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {
  currentUser: User = new User();
  editedUser: User = new User(); // Create a new instance to hold edited data

  message: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (!currentUserString) {
      this.router.navigate(['/']);
    } else {
      this.currentUser = JSON.parse(currentUserString);
      this.editedUser = this.currentUser;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.message = '';

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
            self.editedUser.profilePicture = img.src as string;
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

  //TODO: Sacuvaj izmenjenog usera na backendu
  saveProfile(): void {
    this.userService.updateUser(this.editedUser).subscribe(
      (response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }


}
