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
    price_calculation: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true
});

PackageSchema.plugin(mongoosePaginate);
const Package = mongoose.model('packages', PackageSchema);


export { Package };