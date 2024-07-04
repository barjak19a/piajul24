import { Component, ElementRef, ViewChild } from '@angular/core';
import { Rectangle, Restaurant, Table } from '../model/restaurant.model';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-show-restaurant',
  templateUrl: './show-restaurant.component.html',
  styleUrls: ['./show-restaurant.component.css']
})
export class ShowRestaurantComponent {
  @ViewChild('mapCanvas', { static: true })
  mapCanvas!: ElementRef<HTMLCanvasElement>;
  restaurant!: Restaurant;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService // Service to fetch restaurant data
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const restaurantName = params['restaurantName']; // Assuming you have a route parameter for restaurant id

      // Fetch restaurant data from backend
      this.restaurantService.getRestaurantByName(restaurantName).subscribe(
        restaurant => {
          this.restaurant = restaurant;
          this.drawRestaurantMap();
        },
        error => {
          console.error('Error fetching restaurant:', error);
          // Handle error as needed
        }
      );
    });
  }

  drawRestaurantMap(): void {
    const ctx = this.mapCanvas.nativeElement.getContext('2d');

    // Fill the background with grey
    ctx!.fillStyle = '#D0D0D0'; // Grey color
    ctx!.fillRect(0, 0, 800, 800);
  
    // Draw tables as circles
    this.restaurant.map.tables.forEach((table: Table) => {
      ctx!.beginPath();
      ctx!.arc(table.x, table.y, table.radius, 0, Math.PI * 2);
      ctx!.fillStyle = 'blue'; // Example color, customize as needed
      ctx!.fill();
      ctx!.closePath();
    });
  
    // Draw bathrooms as rectangles
    this.restaurant.map.bathrooms.forEach((bathroom: Rectangle) => {
      ctx!.fillStyle = 'green'; // Example color, customize as needed
      ctx!.fillRect(bathroom.x, bathroom.y, bathroom.width, bathroom.height);
    });
  
    // Draw kitchens as rectangles
    this.restaurant.map.kitchens.forEach((kitchen: Rectangle) => {
      ctx!.fillStyle = 'red'; // Example color, customize as needed
      ctx!.fillRect(kitchen.x, kitchen.y, kitchen.width, kitchen.height);
    });
  }
}
