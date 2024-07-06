import { Component } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { FoodService } from '../food.service';
import { Food } from '../model/food.model';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../model/order.model';
import { UserService } from '../users.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.css']
})
export class RestaurantMenuComponent {
  restaurantName: string = '';
  restaurant!: Restaurant;
  foods: Food[] = [];
  cart: any[] = [];
  username: string = '';

  constructor(private foodService: FoodService, private route: ActivatedRoute, private userService: UserService, private orderService: OrderService) {}

  ngOnInit() {
    if(this.userService.currentUserValue != null) {
      this.username = this.userService.currentUserValue.username;
    }

    this.route.params.subscribe(params => {
      this.restaurantName = params['restaurantName'];
      this.fetchFoodsByRestaurant();
    });
  }

  fetchFoodsByRestaurant(): void {
    this.foodService.fetchFoodsByRestaurant(this.restaurantName)
      .subscribe(
        (foods: Food[]) => {
          this.foods = foods;
          console.log('Foods:', foods);
        },
        (error) => {
          console.error('Error fetching foods:', error);
        }
      );
  }


  addToCart(food: Food): void {
    // Implement your logic to add food to cart (e.g., push to an array, send to cart service)
    console.log('Added to cart:', food);
    this.cart.push({ food, quantity: food.quantity });
  }


  finishOrder() {
    const order: Order = {
      username: this.username,
      restaurantName: this.restaurantName,
      foods: this.cart.map((item) => ({ food: item.food, quantity: item.quantity })),
    };

    this.orderService.placeOrder(order).subscribe(
      (response) => {
        console.log('Order placed successfully:', response);
        // Reset cart after successful order
        this.cart = [];
      },
      (error) => {
        console.error('Failed to place order:', error);
      }
    );
  }
}
