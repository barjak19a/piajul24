import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users.service';

@Component({
  selector: 'app-admin-edit-guest',
  templateUrl: './admin-edit-guest.component.html',
  styleUrls: ['./admin-edit-guest.component.css']
})
export class AdminEditGuestComponent {
  user: User | undefined;
  editedUser!: User;

  message!: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUserValue;
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/adminlogin']);
      return;
    }
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.userService.getUserByUsername(username).subscribe(
        user => {
          this.user = user;
          this.editedUser = user;
        },
        error => {
          console.error('Error fetching user:', error);
          // Handle error as needed
        }
      );
    });
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

  saveProfile(): void {
    this.userService.updateUser(this.editedUser).subscribe(
      (response) => {
        this.router.navigate(['/admin-guest-list']);
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
