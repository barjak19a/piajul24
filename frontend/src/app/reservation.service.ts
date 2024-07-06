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
}