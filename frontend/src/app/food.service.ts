import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from './model/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch foods by restaurantName
  fetchFoodsByRestaurant(restaurantName: string): Observable<Food[]> {
    const url = `${this.apiUrl}/foods`; // Assuming your endpoint is /foods POST request

    return this.http.post<Food[]>(url, { restaurantName });
  }
}
