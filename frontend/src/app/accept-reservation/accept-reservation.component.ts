import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { UserService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';
import { Rectangle, Restaurant, Table } from '../model/restaurant.model';
import { RestaurantService } from '../restaurant.service';
import { Reservation } from '../model/reservation.model';

@Component({
  selector: 'app-accept-reservation',
  templateUrl: './accept-reservation.component.html',
  styleUrls: ['./accept-reservation.component.css']
})
export class AcceptReservationComponent {
  @ViewChild('mapCanvas', { static: true })
  mapCanvas!: ElementRef<HTMLCanvasElement>;
  currentWaiter!: User;
  currentRestaurant!: Restaurant;
  selectedTable!: Table;
  selectedTableId!: string;
  reservation!: Reservation;
  availableTables: Table[] = [];

  message!: string;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private userService: UserService,
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    const currentUser = this.userService.currentUserValue;
    if (!currentUser || currentUser.role !== 'waiter') {
      this.router.navigate(['/login']);
      return;
    }
    this.route.params.subscribe(params => {
      const reservationId = params['reservationId']; // Assuming you have a route parameter for restaurant id

      this.reservationService.fetchReservationsById(reservationId).subscribe(reservation => {
        this.reservation = reservation as Reservation;

        this.restaurantService.getRestaurantByName(this.reservation.restaurantName).subscribe(
          restaurant => {
            this.currentRestaurant = restaurant as Restaurant;
            

            this.currentRestaurant.map.tables.forEach((table: Table) => {
              const startDateTimeString = `${this.reservation.date}T${this.reservation.time}:00`;
              const startDateTime = new Date(startDateTimeString);
              startDateTime.setHours(startDateTime.getHours() - 3);

              let data = {
                tableId: table._id,
                startTime: startDateTime
              };

              this.reservationService.getTableStatus(data).subscribe((response: any) => {
                  // console.log(table._id);
                  // console.log(response);
                  table.status = response['status'];
                  if(response['status'] == 'available' && table.numberOfTableSeats >= this.reservation.guests) {
                    this.availableTables.push(table);
                  }

                  this.drawRestaurantMap();
              });
            });
          },
          error => {
            console.error('Error fetching restaurant:', error);
            // Handle error as needed
          }
        );
      }, error => {
        console.error('Error fetching reservation :', error);
      });
    });
    if(this.userService.currentUserValue != null) {
      this.currentWaiter = this.userService.currentUserValue;
    }
  }

  private isWithinWorkingHours(date: Date): boolean {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const start = this.parseTimeToMinutes(this.currentRestaurant.workingHours.start);
    const end = this.parseTimeToMinutes(this.currentRestaurant.workingHours.end);
    const current = hours * 60 + minutes;

    return current >= start && current <= end;
  }

  // Helper function to convert time to minutes
  private parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  drawRestaurantMap(): void {
    const ctx = this.mapCanvas.nativeElement.getContext('2d');

    ctx!.fillStyle = '#D0D0D0'; 
    ctx!.fillRect(0, 0, 800, 800);
  
    this.currentRestaurant.map.tables.forEach((table: Table) => {
      ctx!.beginPath();
      ctx!.arc(table.x, table.y, table.radius, 0, Math.PI * 2);
      if(table.status == 'available') {
        ctx!.fillStyle = 'green';
      } else if(table.status == 'unavailable') {
        ctx!.fillStyle = 'red'; 
      } else {
        ctx!.fillStyle = 'blue'; 
      }


      ctx!.fill();
      ctx!.closePath();

      ctx!.font = '12px Arial';
      ctx!.fillStyle = 'white';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText(table.numberOfTableSeats.toString(), table.x, table.y);
    });
  
    // Draw bathrooms as rectangles
    this.currentRestaurant.map.bathrooms.forEach((bathroom: Rectangle) => {
      ctx!.fillStyle = 'green'; // Example color, customize as needed
      ctx!.fillRect(bathroom.x, bathroom.y, bathroom.width, bathroom.height);
    });
  
    // Draw kitchens as rectangles
    this.currentRestaurant.map.kitchens.forEach((kitchen: Rectangle) => {
      ctx!.fillStyle = 'red'; // Example color, customize as needed
      ctx!.fillRect(kitchen.x, kitchen.y, kitchen.width, kitchen.height);
    });
  }

  acceptReservation() {
    if (!this.selectedTable || this.selectedTable.status !== 'available' || !this.isWithinWorkingHours(new Date())) {
      this.message = 'Please select an available table within restaurant working hours.';
      return;
    }
    this.reservation.tableId = this.selectedTableId;
    this.reservation.status = 'accepted';
    this.reservation.waiterUsername = this.userService.currentUserValue!.username;
    this.reservationService.updateReservation(this.reservation).subscribe((response) => {
      console.log(response);
      this.router.navigate(['/waiter-reservations']);
    }, error => console.log(error));
  }

  chooseTable() {
    console.log(this.selectedTableId);
    this.availableTables.forEach((table: Table) => table.status = 'available');
    const selectedTable = this.currentRestaurant.map.tables.find((table: Table) => table._id === this.selectedTableId);
    selectedTable!.status = 'selected';
    this.drawRestaurantMap();
  }
}
