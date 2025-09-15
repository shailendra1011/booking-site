import { Taxonomy } from "../../Models/Taxonomy.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { fileUpload } from "../../Helper/util.mjs";
import logger from '../../Helper/logger.mjs';
import mongoose from 'mongoose';
import { log } from "console";
import { type } from "os";

export class TaxonomyController {
    static async addTaxonomy(req, res) {
        try {

            const valid = new Validator(req.body, {
                channelId: 'required',
                title: 'required',
                slug: 'required',
                type: 'required',
            });
            // Check if the slug already exists
            let isExistSlug = await Taxonomy.findOne({ channelId: req.body.channelId, slug: req.body.slug , type:req.body.slug});
            if (!req.body.hasOwnProperty('taxonomyId') && isExistSlug) {
                return customValidationFailed(res, 'Slug already exists!', 422);
            }
            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            req.body.parentId = (req.body.parentId == '') ? null : req.body.parentId;
            if (req.body.taxonomyId) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.taxonomyId) };
                const existingTaxonomy = await Taxonomy.findOne(filter);
                if (!existingTaxonomy) {
                    return customValidationFailed(res, 'Taxonomy not found', 404);
                }
                req.body.deletedAt = req.body.status ? ((req.body.status == 'inactive') ? new Date() : null) : null;
                await Taxonomy.findOneAndUpdate(filter, req.body);
                return success(res, "taxonomy updated successfully!");
            } else {
                try {
                    req.body.deletedAt = req.body.status ? ((req.body.status === 'inactive') ? new Date() : null) : null;
                    req.body.seo_image = req.files && req.files.seo_image ? fileUpload(req.files.seo_image, `${req.body.slug}-seo_image`) : '';
                } catch (fileError) {
                    console.error('File upload error:', fileError.message);
                }

                await Taxonomy.create(req.body);
                return success(res, "Taxonomy added successfully!");
            }
        } catch (error) {
            console.log(error);

            return failed(res, {}, error.message, 400);
        }
    }

    static async taxonomyList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const type = req.query.type;

            let query = {};

            if (type === 'priorityList') {
                query.type = 'priorityList';
            } else {
                query.type = { $ne: 'priorityList' };
            }

            const listing = await Taxonomy.paginate(query, {
                page,
                limit,
                sort: { title: 1 },
                populate: ['channelId']
            });

            return success(res, "taxonomy list", listing, 200);
        } catch (error) {
            console.log(error);

            return failed(res, {}, error.message, 400);
        }
    }
    static async taxonomyListing(req, res) {
        try {
            const { channelId, type } = req.query;
            let filters = {};

            if (channelId) {
                filters.channelId = channelId;
            }

            if (type) {
                filters.type = type === 'category' ? 'category' : 'tag';
                const data = await Taxonomy.find(filters);
                return success(res, `taxonomy list`, data, 200);
            } else {
                const data = await Taxonomy.find(filters);

                const grouped = {
                    tags: [],
                    categories: []
                };

                // Separate data by type
                const categories = data.filter(item => item.type === 'category');
                const subCategories = data.filter(item => item.type === 'sub_category');
                const tags = data.filter(item => item.type === 'tag');

                // Map subcategories into their parent categories
                const categoryMap = categories.map(category => {
                    const subs = subCategories.filter(sub => String(sub.parentId) === String(category._id));
                    return {
                        ...category._doc,
                        subCategory: subs
                    };
                });

                grouped.categories = categoryMap;
                grouped.tags = tags;

                return success(res, `taxonomy list`, grouped, 200);
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async categories(req, res) {
        try {
            const channelId = req.query.channelId;
            const data = await Taxonomy.find({ channelId: channelId });
            return success(res, 'category list', data, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
}