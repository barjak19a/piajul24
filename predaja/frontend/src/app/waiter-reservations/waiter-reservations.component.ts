import { Component } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { UserService } from '../users.service';
import { User } from '../model/user.model';
import { Reservation } from '../model/reservation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiter-reservations',
  templateUrl: './waiter-reservations.component.html',
  styleUrls: ['./waiter-reservations.component.css']
})
export class WaiterReservationsComponent {
  currentWaiter!: User;
  pendingReservations!: Reservation[];

  currentReservations!: Reservation[];

  reason: string = '';

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.userService.currentUserValue != null) {
      this.currentWaiter = this.userService.currentUserValue;

      this.refreshReservations();
      this.getCurrentReservations();
    }
  }

  acceptReservation(reservation: Reservation) {
    // Assuming you have an update method in your service to change reservation status

    // reservation.status = 'accepted';
    // this.reservationService.updateReservation(reservation)
    //   .subscribe(
    //     (response) => {
    //       this.refreshReservations();
    //     },
    //     error => {
    //       console.error('Error accepting reservation:', error);
    //     }
    //   );
    this.router.navigate(['/accept-reservation', reservation._id]);
  }

  private refreshReservations() {
    this.reservationService.fetchReservationsForRestaurant(this.currentWaiter.restaurantName).subscribe((response: any) => {
      this.pendingReservations = (response as Reservation[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, error => {
      console.error('Error fetching reservations:', error);
    });
  }

  declineReservation(reservation: Reservation) {
    reservation.status = 'declined';
  }

  updateDeclinedReservation(reservation: Reservation) {
    this.reservationService.updateReservation(reservation)
      .subscribe(
        () => {
          // Optionally, update the local array if needed
          // this.pendingReservations = this.pendingReservations.filter(r => r._id !== reservation._id);
          this.refreshReservations();
        },
        error => {
          console.error('Error declining reservation:', error);
        }
      );
  }

  getCurrentReservations() {
    this.reservationService.getCurrentReservations(this.currentWaiter.restaurantName).subscribe((response: any) => {
      this.currentReservations = (response as Reservation[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }

  confirmReservation(reservation: Reservation) {
    reservation.status = "used";

    this.reservationService.updateReservation(reservation)
    .subscribe(
      () => {
        // Optionally, update the local array if needed
        // this.pendingReservations = this.pendingReservations.filter(r => r._id !== reservation._id);
        this.refreshReservations();
        this.getCurrentReservations();
      },
      error => {
        console.error('Error declining reservation:', error);
      }
    );
  }

  markAsNotUsed(reservation: Reservation) {
    reservation.status = "not used";

    this.reservationService.updateReservation(reservation)
    .subscribe(
      () => {
        // Optionally, update the local array if needed
        // this.pendingReservations = this.pendingReservations.filter(r => r._id !== reservation._id);
        this.refreshReservations();
        this.getCurrentReservations();
      },
      error => {
        console.error('Error declining reservation:', error);
      }
    );
  }
}
