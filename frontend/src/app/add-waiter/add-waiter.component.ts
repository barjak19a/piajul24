import { Component } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../users.service';
import { AuthService } from '../auth.service';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-add-waiter',
  templateUrl: './add-waiter.component.html',
  styleUrls: ['./add-waiter.component.css']
})
export class AddWaiterComponent {
  waiter: User = new User();
  restaurants: Restaurant[] = [];
  message: string = '';

  constructor(private authService: AuthService, private restaurantService: RestaurantService) {
    this.fetchAllRestaurants();

    this.waiter.role = 'waiter';
    this.waiter.status = 'approved';
  }

  fetchAllRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe(
      (restaurants) => {
        this.restaurants = restaurants;
        console.log('Fetched restaurants:', this.restaurants);
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.waiter.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addWaiter(): void {
    this.authService.register(this.waiter).subscribe(
      response => {
        this.message = 'Waiter added successfully';
      },
      error => {
        this.message = 'Failed to add waiter';
      }
    );
  }
}
