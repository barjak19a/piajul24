// backend/models/order.model.ts

import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the order schema
const OrderSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
    deliveryTime: {
    type: String
  },
  foods: [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Create and export the Order model
export default mongoose.model('Order', OrderSchema, 'orders');
