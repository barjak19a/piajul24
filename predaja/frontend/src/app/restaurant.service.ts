import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from './model/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

    getRestaurantCount(): Observable<{ count: number }> {
      return this.http.get<{ count: number }>(`${this.apiUrl}/restaurants-count`);
    }

    getAllRestaurants(): Observable<Restaurant[]> {
      const url = `${this.apiUrl}/get-all-restaurants`;
      return this.http.get<Restaurant[]>(url);
    }

    getRestaurantByName(name: string): Observable<Restaurant> {
      let data = {
        restaurantName: name
      };

      const url = `${this.apiUrl}/get-restaurant-by-name`;
      return this.http.post<Restaurant>(url, data);
    }

    addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
      const url = `${this.apiUrl}/add-restaurant`;
      return this.http.post<Restaurant>(url, restaurant);
    }
}
