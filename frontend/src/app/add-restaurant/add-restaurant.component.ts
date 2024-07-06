import { Component, ElementRef, ViewChild } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent {
  restaurant: Restaurant = new Restaurant();
  mapFile: File | null = null;

  message: string = "";
  messageSuccess: string = "";

  constructor(private restaurantService: RestaurantService) {}

  onFileSelected(event: any): void {
    this.mapFile = event.target.files[0];
  }

  onSubmit(): void {
    if (!(this.restaurant.address != "" && this.restaurant.name != "" && this.restaurant.type != "")) {
      this.message = "Please fill in the form";
      return;
    }

    if (this.mapFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.restaurant.map = JSON.parse(e.target.result);
          this.saveRestaurant();
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(this.mapFile);
    } else {
      this.message = "Choose JSON file with restaurant data";
      this.messageSuccess = "";
    }
  }

  saveRestaurant(): void {
    this.restaurantService.addRestaurant(this.restaurant).subscribe(
      response => {
        console.log('Restaurant saved successfully:', response);
        this.messageSuccess = 'Restaurant added successfully.';
        this.message = "";
        this.resetForm();
      },
      error => {
        console.error('Error saving restaurant:', error);
        this.message = 'Failed to add restaurant.';
        this.messageSuccess = "";
      }
    );
  }

  resetForm(): void {
    this.restaurant = new Restaurant();
    this.mapFile = null;
  }
}
