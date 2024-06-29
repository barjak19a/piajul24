import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the restaurant schema
const Restaurant = new Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    type: {
        type: String
    }
});

// Create and export the Restaurant model
export default mongoose.model('Restaurant', Restaurant, 'restaurants');
