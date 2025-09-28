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
    inclusions: [
        {
            type: {
                type: String,
                required: true
            }
        }
    ],
    exclusions: [
        {
            type: {
                type: String,
                required: true
            }
        }
    ],
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
}, {
    timestamps: true
});

VehicleSchema.plugin(mongoosePaginate);
const Vehicle = mongoose.model('vehicles', VehicleSchema);


export { Vehicle };