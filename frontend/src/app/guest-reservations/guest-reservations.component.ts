import { Component } from '@angular/core';
import { Reservation } from '../model/reservation.model';
import { ReservationService } from '../reservation.service';
import { UserService } from '../users.service';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-reservations',
  templateUrl: './guest-reservations.component.html',
  styleUrls: ['./guest-reservations.component.css']
})
export class GuestReservationsComponent {
  reservations: Reservation[] = [];
  username!: string; // Replace with actual username or fetch dynamically
  user!: User;

  constructor(private reservationService: ReservationService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUserValue;
    if (!currentUser || currentUser.role !== 'guest') {
      this.router.navigate(['/login']);
      return;
    }
    if(this.userService.currentUserValue != null) {
      this.user = this.userService.currentUserValue;
      this.username = this.user.username;
    }
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getReservationsByUser(this.username)
      .subscribe(reservations => {
        this.reservations = reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());;
      }, error => {
        console.error('Error fetching reservations:', error);
      });
  }
}
