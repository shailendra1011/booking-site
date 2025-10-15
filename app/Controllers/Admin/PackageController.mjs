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
                package_name: 'required|string',
                from_city: 'required|string',
                to_city: 'required|array',
                // pickup_location: 'required|string',
                // drop_location: 'required|string',
                vehicle_name: 'required|string',
                // fuel_types: 'required|string',
                inclusions: 'required|array',
                exclusions: 'required|array',
                price: 'required',
                gst: 'required',
                to_date: 'required',
                from_date: 'required',
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);



            if (typeof req.body.inclusions === 'string') {
                req.body.inclusions = JSON.parse(req.body.inclusions);
            }

            if (typeof req.body.exclusions === 'string') {
                req.body.exclusions = JSON.parse(req.body.exclusions);
            }
            if (typeof req.body.to_city === 'string') {
                req.body.to_city = JSON.parse(req.body.to_city);
            }
            const data = {
                package_name: req.body.package_name,
                from_city: req.body.from_city,
                to_city: req.body.to_city,
                vehicle_name: req.body.vehicle_name,
                inclusions: req.body.inclusions,
                exclusions: req.body.exclusions,
                price: req.body.price,
                gst: req.body.gst,
                from_date: req.body.from_date,
                to_date: req.body.to_date,
                additional_notes: req.body.additional_notes,
                status: 1
            };

            if (req.body.package_id) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.package_id) };
                const existingPackage = await Package.findOne(filter);
                if (!existingPackage) {
                    return customValidationFailed(res, 'Package not found', 404);
                }
                await Package.findOneAndUpdate(filter, data);
                return success(res, "Package updated successfully!");
            } else {
                await Package.create(data);
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
            const { package_id } = req.query;
            if (!package_id) {
                return customValidationFailed(res, 400, 'Package Id not found', {});
            }
            const deletedPackage = await Package.findByIdAndDelete(package_id);
            if (!deletedPackage) {
                return customValidationFailed(res, 404, 'Package not found', {});
            }
            return success(res, "Package deleted successfully", {}, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async inactivePackage(req, res) {
        try {
            const { package_id, status } = req.body;

            if (!package_id) {
                return customValidationFailed(res, 400, 'Package ID is required', {});
            }

            const filter = { _id: mongoose.Types.ObjectId(package_id) };
            const update = { status: !!status }; // Convert to boolean

            const updatedPackage = await Package.findOneAndUpdate(filter, update, { new: true });

            if (!updatedPackage) {
                return customValidationFailed(res, 404, 'Package not found', {});
            }

            return success(
                res,
                `Package ${update.status ? 'activated' : 'inactivated'} successfully`,
                updatedPackage,
                200
            );

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }


}