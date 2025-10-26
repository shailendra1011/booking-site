import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const PackageSchema = mongoose.Schema({

    package_name: {
        type: String,
        required: true
    },
    from_city: {
        type: String,
        required: true
    },

    to_city: [
        {
            city: {
                type: String,
                required: true
            }
        }
    ],
    pickup_location: {
        type: String,
        required: false
    },
    drop_location: {
        type: String,
        required: false
    },
    vehicle_name: {
        type: String,
        required: false
    },
    // fuel_types: {
    //     type: String,
    //     required: false
    // },
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
    price: {
        type: String,
        required: true
    },
    total_km: {
        type: String,
        required: false
    },
    gst: {
        type: String,
        required: true
    },
    from_date: {
        type: Date,
        required: false
    },
    to_date: {
        type: Date,
        required: false
    },
    additional_notes: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});

PackageSchema.plugin(mongoosePaginate);
const Package = mongoose.model('packages', PackageSchema);


export { Package };