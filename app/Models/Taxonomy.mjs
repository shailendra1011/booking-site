import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const TaxonomySchema = mongoose.Schema({
    channelId: {
        type: mongoose.Types.ObjectId,
        ref: 'channels',
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Taxonomy',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['category', 'sub_category', 'tag','priorityList'],
        required: true
    },
    seo_title: {
        type: String,
        required: false
    },
    seo_description: {
        type: String,
        required: false
    },
    seo_keywords: {
        type: String,
        required: false
    },
    seo_image: {
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

TaxonomySchema.plugin(mongoosePaginate);
const Taxonomy = mongoose.model('taxonomies', TaxonomySchema);


export { Taxonomy };