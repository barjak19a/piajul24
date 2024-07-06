import { Injectable } from '@angular/core';
import { Order } from './model/order.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/place-order`, order);
  }

  getOrdersByUsername(username: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${username}`);
  }
}
