import { Component } from '@angular/core';
import { Order } from '../model/order.model';
import { OrderService } from '../order.service';
import { UserService } from '../users.service';

@Component({
  selector: 'app-guest-orders',
  templateUrl: './guest-orders.component.html',
  styleUrls: ['./guest-orders.component.css']
})
export class GuestOrdersComponent {
  orders: Order[] = [];
  username = '';

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
    if(this.userService.currentUserValue != null) {
      this.username = this.userService.currentUserValue.username;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersByUsername(this.username).subscribe(
      (orders) => {
        this.orders = orders;
        console.log('Orders loaded successfully:', orders);
      },
      (error) => {
        console.error('Failed to load orders:', error);
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
}
