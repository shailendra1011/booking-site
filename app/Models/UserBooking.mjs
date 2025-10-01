// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const UserBookingSchema = mongoose.Schema({
    bookingId: {
        type: String,
        required: true
    },
    booking_type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: false
    },
    vehicle_category: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    origin_city: {
        type: String,
        required: true
    },
    transfer_city: {
        type: String,
        required: true
    },
    pickup_address: {
        type: String,
        required: true
    },
    drop_address: {
        type: String,
        required: true
    },
    booking_date: {
        type: Date,
        required: true
    },
    total_price: {
        type: String,
        required: true
    },
    isReturn: {
        type: Boolean,
        required: true
    },

    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

UserBookingSchema.methods.hash = function (password) {
    return bcrypt.hashSync(password, 12);
};
UserBookingSchema.plugin(mongoosePaginate);
const UserBooking = mongoose.model('user_bookings', UserBookingSchema);

export { UserBooking };
