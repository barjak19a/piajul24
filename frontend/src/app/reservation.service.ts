import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from './model/reservation.model';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  makeReservation(reservation: Reservation): Observable<any> {
    return this.http.post(`${this.apiUrl}/make-reservation`, reservation);
  }

  fetchReservationsForRestaurant(restaurantName: string) {
    let data = {
      restaurantName: restaurantName
    };
    return this.http.post(`${this.apiUrl}/get-reservations`, data);
  }

  updateReservation(reservation: Reservation) {
    return this.http.post(`${this.apiUrl}/update-reservation`, reservation);
  }

  fetchReservationsById(reservationId: string) {
    let data = {
      reservationId: reservationId
    };
    return this.http.post(`${this.apiUrl}/get-reservation`, data);
  }

  getTableStatus(data: any) {
    return this.http.post(`${this.apiUrl}/get-table-status`, data);
  }

  getReservationsByUser(username: string): Observable<Reservation[]> {
    return this.http.post<Reservation[]>(`${this.apiUrl}/reservations-by-user`, { username });
  }

  getCurrentReservations(restaurantName: string) {
    let data = {
      restaurantName: restaurantName
    };
    return this.http.post(`${this.apiUrl}/get-current-reservations`, data);
  }
}