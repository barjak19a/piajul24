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

  getReservationsCountLast1Day() {
    return this.http.get(`${this.apiUrl}/reservations-last-1-days`);
  }

  getReservationsCountLast7Days() {
    return this.http.get(`${this.apiUrl}/reservations-last-7-days`);
  }

  getReservationsCountLast30Days() {
    return this.http.get(`${this.apiUrl}/reservations-last-30-days`);
  }

  getTotalGuestsByWaiter(waiterUsername: string): Observable<any> {
    const url = `${this.apiUrl}/total-guests-by-waiter`;
    const body = { waiterUsername };
    return this.http.post<any>(url, body);
  }

  getWaiterGuests(restaurantName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/waiter-guests`, { restaurantName });
  }

  getAverageReservationsPerDay(restaurantName: string) {
    return this.http.post<{ averageReservationsPerDay: {dayOfWeek: number, averageReservations: number}[] }>(`${this.apiUrl}/average-reservations-per-day`, { restaurantName });
  }
}