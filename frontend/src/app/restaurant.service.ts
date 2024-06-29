import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

    getRestaurantCount(): Observable<{ count: number }> {
      return this.http.get<{ count: number }>(`${this.apiUrl}/restaurants-count`);
    }
}
