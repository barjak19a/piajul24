import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { UserService } from '../users.service';
import { Restaurant } from '../model/restaurant.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurantCount: number = 0; // Initialize with default value
  guestUsersCount: number = 0; // Initialize with default value
  restaurants: Restaurant[] = []; // Array to hold fetched restaurants

  constructor(
    private restaurantService: RestaurantService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchRestaurantCount();
    this.fetchGuestUsersCount();
    this.fetchAllRestaurants();
  }

  fetchRestaurantCount(): void {
    this.restaurantService.getRestaurantCount().subscribe(
      (response) => {
        this.restaurantCount = response.count;
        console.log('Total number of restaurants:', this.restaurantCount);
      },
      (error) => {
        console.error('Error fetching restaurant count:', error);
      }
    );
  }

  fetchGuestUsersCount(): void {
    this.userService.getGuestUsersCount().subscribe(
      (response) => {
        this.guestUsersCount = response.count;
        console.log('Total number of guest users:', this.guestUsersCount);
      },
      (error) => {
        console.error('Error fetching guest users count:', error);
      }
    );
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

  isLoggedIn(): boolean {
    return this.userService.currentUserValue != null;
  }
}
