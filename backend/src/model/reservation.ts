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
    }
});

// Create and export the Reservation model
export default mongoose.model('Reservation', Reservation, 'reservations');
