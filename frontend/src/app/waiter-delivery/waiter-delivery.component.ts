import { Component } from '@angular/core';
import { Order } from '../model/order.model';
import { OrderService } from '../order.service';
import { UserService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiter-delivery',
  templateUrl: './waiter-delivery.component.html',
  styleUrls: ['./waiter-delivery.component.css']
})
export class WaiterDeliveryComponent {
  orders: Order[] = [];
  restaurantName = '';

  constructor(private orderService: OrderService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    const currentUser = this.userService.currentUserValue;
    if (!currentUser || currentUser.role !== 'waiter') {
      this.router.navigate(['/login']);
      return;
    }
    if(this.userService.currentUserValue != null) {
      this.restaurantName = this.userService.currentUserValue.restaurantName;
    }

    this.loadPendingOrders();
  }

  loadPendingOrders(): void {
    this.orderService.getPendingOrdersByRestaurant(this.restaurantName).subscribe(
      (orders) => {
        this.orders = orders;
        console.log('Pending orders loaded successfully:', orders);
      },
      (error) => {
        console.error('Failed to load pending orders:', error);
      }
    );
  }

  calculateTotalPrice(foods: any[]): number {
    let totalPrice = 0;
    foods.forEach((item) => {
      totalPrice += item.food.price * item.quantity;
    });
    return totalPrice;
  }


  acceptOrder(order: Order): void {
    order.status = 'accepted'; // Update order status to 'accepted'
    this.updateOrder(order);
  }

  declineOrder(order: Order): void {
    order.status = 'declined'; // Update order status to 'declined'
    this.updateOrder(order);
  }

  updateOrder(order: Order): void {
    // Update the order in the database via the service
    this.orderService.updateOrder(order).subscribe(
      () => {
        console.log('Order updated successfully:', order);
        // Optionally, reload pending orders after update
        this.loadPendingOrders();
      },
      (error) => {
        console.error('Failed to update order:', error);
      }
    );
  }
}
