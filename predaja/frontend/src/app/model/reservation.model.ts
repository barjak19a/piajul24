export class Reservation {
    _id?: string;
    date: string = '';
    time: string = '';
    description: string = '';
    guests: number = 1;
    restaurantName: string = '';
    username: string = '';
    status: string = '';
    reason: string = '';
    tableId: string = '';
    waiterUsername?: string;
  }