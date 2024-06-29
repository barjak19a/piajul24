import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurantCount: number = 0; // Initialize with default value

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.fetchRestaurantCount();
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
}
