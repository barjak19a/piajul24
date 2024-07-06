import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the reservation schema
const Reservation = new Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', "used", "not used"],
        default: 'pending'
    },
    reason: {
        type: String
    },
    tableId: {
        type: ObjectId
    },
});

// Create and export the Reservation model
export default mongoose.model('Reservation', Reservation, 'reservations');
