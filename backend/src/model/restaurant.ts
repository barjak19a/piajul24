import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TableSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    radius: { type: Number, required: true }
});

const RectangleSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
});

const MapSchema = new Schema({
    tables: { type: [TableSchema], required: true },
    bathrooms: { type: [RectangleSchema], required: true },
    kitchens: { type: [RectangleSchema], required: true }
});

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
    },
    description: {
        type: String
    },
    contact: {
        type: String
    },
    workingHours: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    map: { type: MapSchema, required: true }
});

// Create and export the Restaurant model
export default mongoose.model('Restaurant', Restaurant, 'restaurants');
