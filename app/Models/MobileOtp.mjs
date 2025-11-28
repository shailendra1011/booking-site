// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const MobileOtpSchema = mongoose.Schema({
    mobile: {
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


MobileOtpSchema.plugin(mongoosePaginate);
const MobileOtp = mongoose.model('mobile_otps', MobileOtpSchema);

export { MobileOtp };
