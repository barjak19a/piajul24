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
  filteredRestaurants: Restaurant[] = [];

  filterName: string = "";
  filterType: string = "";
  filterAddress: string = "";

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
        this.filteredRestaurants = restaurants;
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

  filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesName = restaurant.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesAddress = restaurant.address.toLowerCase().includes(this.filterAddress.toLowerCase());
      const matchesType = restaurant.type.toLowerCase().includes(this.filterType.toLowerCase());
      return matchesName && matchesAddress && matchesType;
    });
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortRestaurants();
  }

  sortRestaurants(): void {
    this.filteredRestaurants.sort((a, b) => {
      const x = a as any;
      const y = b as any;
      const valueA = x[this.sortColumn].toLowerCase();
      const valueB = y[this.sortColumn].toLowerCase();
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
