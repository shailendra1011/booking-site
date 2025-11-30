// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const EmailOtpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    mobile_otp: {
        type: String,
        required: true
    },
    email_otp: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});


EmailOtpSchema.plugin(mongoosePaginate);
const EmailOtp = mongoose.model('email_otps', EmailOtpSchema);

export { EmailOtp };
