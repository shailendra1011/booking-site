import { Vehicle } from "../../Models/Vehicle.mjs";
import { Package } from "../../Models/Package.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { fileUpload } from "../../Helper/util.mjs";
import { category } from "../../../config/category.mjs";
import logger from '../../Helper/logger.mjs';
import mongoose from 'mongoose';
import { log } from "console";
import { type } from "os";

export class PackageController {

    static async addEditPackage(req, res) {
        try {
            const valid = new Validator(req.body, {
                from: 'required',
                to: 'required',
                pickup_location: 'required',
                drop_location: 'required',
                vehicle_category: 'required',
                fuel_types: 'required',
                inclusions: 'required',
                exclusions: 'required',
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            if (req.body.packageId) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.packageId) };
                const existingpackage = await Package.findOne(filter);
                if (!existingpackage) {
                    return customValidationFailed(res, 'Package not found', 404);
                }
                await Package.findOneAndUpdate(filter, req.body);
                return success(res, "package updated successfully!");
            } else {
                await Package.create(req.body);
                return success(res, "Package added successfully!");
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async packageList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const type = req.query.type;

            let query = {};

            const listing = await Package.paginate(query, {
                page,
                limit,
                sort: { createdAt: 1 }
            });

            return success(res, "package list", listing, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async deletePackage(req, res) {
        try {
            Package.deleteOne({ _id: req.body.vehicleId })
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

}