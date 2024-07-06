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
                  if(response['status'] == 'available') {
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

  drawRestaurantMap(): void {
    const ctx = this.mapCanvas.nativeElement.getContext('2d');

    // Fill the background with grey
    ctx!.fillStyle = '#D0D0D0'; // Grey color
    ctx!.fillRect(0, 0, 800, 800);
  
    // Draw tables as circles
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
    this.reservation.tableId = this.selectedTableId;
    this.reservation.status = 'accepted';
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
