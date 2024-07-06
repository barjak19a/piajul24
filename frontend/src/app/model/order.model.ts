import { Food } from "./food.model";

export class Order {
    username!: string;
    restaurantName!: string;
    foods!: { food: Food; quantity: number }[];
}