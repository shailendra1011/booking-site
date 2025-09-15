import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const PackageSchema = mongoose.Schema({

    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    pickup_location: {
        type: String,
        required: false
    },
    drop_location: {
        type: String,
        required: false
    },
    Vehicle_category: {
        type: String,
        required: false
    },
    fuel_types: {
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