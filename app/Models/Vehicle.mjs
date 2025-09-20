import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const VehicleSchema = mongoose.Schema({

    category: {
        type: String,
        required: true
    },
    vehicle_name: {
        type: String,
        required: true
    },
    vehicle_image: {
        type: String,
        required: false
    },
    inclusions: {
        type: String,
        required: false
    },
    exclusions: {
        type: String,
        required: false
    },
    price_per_km: {
        type: String,
        required: false
    },
    total_seat: {
        type: String,
        required: false
    },
    luggage: {
        type: String,
        required: false
    },
    fuel_type: {
        type: String,
        required: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

VehicleSchema.plugin(mongoosePaginate);
const Vehicle = mongoose.model('vehicles', VehicleSchema);


export { Vehicle };