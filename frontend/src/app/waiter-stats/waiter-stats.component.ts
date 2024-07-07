import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { UserService } from '../users.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiter-stats',
  templateUrl: './waiter-stats.component.html',
  styleUrls: ['./waiter-stats.component.css']
})
export class WaiterStatsComponent implements OnInit, AfterViewInit {
  waiterUsername = '';
  totalGuestsByDate: { _id: string, totalGuests: number }[] = [];
  barChart: any;
  pieChart: any;
  histogramChart: any;
  waiterGuests: any[] = [];
  averageReservationsPerDay: {dayOfWeek: number, averageReservations: number}[] = [];

  @ViewChild('barChart') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('histogramChart') histogramChartCanvas!: ElementRef<HTMLCanvasElement>;
  constructor(private reservationService: ReservationService, private userService: UserService, private renderer: Renderer2, private router: Router) { }

  ngAfterViewInit(): void {
      this.renderBarChart();
      this.createPieChart(this.waiterGuests);
      this.renderAverageReservationsChart();
  }

  ngOnInit(): void {
    const currentUser = this.userService.currentUserValue;
    if (!currentUser || currentUser.role !== 'waiter') {
      this.router.navigate(['/login']);
      return;
    }
    this.waiterUsername = this.userService.currentUserValue!.username;
    this.getTotalGuestsByWaiter();
    this.getWaiterGuests();
    this.fetchAverageReservationsPerDay();
    //this.renderChart();
  }

  getTotalGuestsByWaiter(): void {
    this.reservationService.getTotalGuestsByWaiter(this.waiterUsername)
      .subscribe(
        (response) => {
          this.totalGuestsByDate = response;
          console.log(response);
          this.renderBarChart();
        },
        (error) => {
          console.error('Error fetching total guests:', error);
        }
      );
  }

  renderBarChart(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const labels = this.generateLast10Days();
    const data = this.generateDataForChart(labels);

    const canvas = this.barChartCanvas.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.barChart = new Chart(ctx, {
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
    }
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
    const guestCountMap = new Map(this.totalGuestsByDate.map(item => [item._id, item.totalGuests]));

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
        this.createPieChart(this.waiterGuests);
      },
      error => {
        console.error('Error fetching waiter guests:', error);
      }
    );
  }

  fetchAverageReservationsPerDay(): void {
    this.reservationService.getAverageReservationsPerDay(this.userService.currentUserValue!.restaurantName).subscribe(
      (data) => {
        this.averageReservationsPerDay = data.averageReservationsPerDay;
        this.renderAverageReservationsChart();
      },
      (error) => {
        console.error('Error fetching average reservations per day:', error);
      }
    );
  }


  createPieChart(data: any): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const labels = data.map((item: any) => item._id);
    const values = data.map((item: any) => item.totalGuests);

    const canvas = this.pieChartCanvas.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Number of Guests',
                data: values,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem: any) {
                    return tooltipItem.label + ': ' + tooltipItem.raw;
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  renderAverageReservationsChart(): void {
    if (this.histogramChart) {
      this.histogramChart.destroy();
    }

    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = Array(7).fill(0);
    this.averageReservationsPerDay.forEach(item => {
      data[item.dayOfWeek - 1] = item.averageReservations;
    });

    const canvas = this.histogramChartCanvas.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.histogramChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Average Reservations',
              data: data,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
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
    }
  }
}

