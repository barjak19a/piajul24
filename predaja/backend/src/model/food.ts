import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the menu item schema
const Food = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    photo: {
        type: String
    },
    restaurantName: {
        type: String
    }
});

// Create and export the MenuItem model
export default mongoose.model('Food', Food, 'foods');