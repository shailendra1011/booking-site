// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const EmailOtpSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});


EmailOtpSchema.plugin(mongoosePaginate);
const EmailOtp = mongoose.model('email_otps', EmailOtpSchema);

export { EmailOtp };
