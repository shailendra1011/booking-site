// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const CitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

CitySchema.methods.hash = function (password) {
    return bcrypt.hashSync(password, 12);
};
CitySchema.plugin(mongoosePaginate);
const City = mongoose.model('cities', CitySchema);

export { City };
