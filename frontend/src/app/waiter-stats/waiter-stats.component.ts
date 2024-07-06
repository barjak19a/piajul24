import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { UserService } from '../users.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-waiter-stats',
  templateUrl: './waiter-stats.component.html',
  styleUrls: ['./waiter-stats.component.css']
})
export class WaiterStatsComponent implements OnInit, AfterViewInit {
  waiterUsername = '';
  totalGuestsByDate: { date: string, totalGuests: number }[] = [];
  chart: any;
  waiterGuests: any[] = [];
  averageReservationsPerDay: any;

  constructor(private reservationService: ReservationService, private userService: UserService) { }

  ngAfterViewInit(): void {
      this.renderChart();
  }

  ngOnInit(): void {
    this.waiterUsername = this.userService.currentUserValue!.username;
    this.getTotalGuestsByWaiter();
    this.getWaiterGuests();
    this.fetchAverageReservationsPerDay();
    this.renderChart();
  }

  getTotalGuestsByWaiter(): void {
    this.reservationService.getTotalGuestsByWaiter(this.waiterUsername)
      .subscribe(
        (response) => {
          this.totalGuestsByDate = response;
          console.log(response);
          this.renderChart();
        },
        (error) => {
          console.error('Error fetching total guests:', error);
        }
      );
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.generateLast10Days();
    const data = this.generateDataForChart(labels);

    this.chart = new Chart('guestChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Guests',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createChart(){
  
    this.chart = new Chart("guestChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
									 '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  generateLast10Days(): string[] {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);
    }
    return labels;
  }

  generateDataForChart(labels: string[]): number[] {
    const data: number[] = [];
    const guestCountMap = new Map(this.totalGuestsByDate.map(item => [item.date, item.totalGuests]));

    labels.forEach(label => {
      data.push(guestCountMap.get(label) || 0);
    });

    return data;
  }

  getWaiterGuests(): void {
    this.reservationService.getWaiterGuests(this.userService.currentUserValue!.restaurantName).subscribe(
      data => {
        this.waiterGuests = data;
        console.log(data);
      },
      error => {
        console.error('Error fetching waiter guests:', error);
      }
    );
  }

  fetchAverageReservationsPerDay() {
    this.reservationService.getAverageReservationsPerDay(this.userService.currentUserValue!.restaurantName).subscribe(
      (data) => {
        this.averageReservationsPerDay = data.averageReservationsPerDay;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching average reservations per day:', error);
        // Handle error as per your application's requirement
      }
    );
  }
}
