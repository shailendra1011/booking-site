// In Admin.mjs
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});


CategorySchema.plugin(mongoosePaginate);
const Category = mongoose.model('categories', CategorySchema);

export { Category };
