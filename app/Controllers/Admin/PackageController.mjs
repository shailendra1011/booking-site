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
                from: 'required|string',
                to: 'required|string',
                pickup_location: 'required|string',
                drop_location: 'required|string',
                vehicle_category: 'required|string',
                fuel_types: 'required|string',
                inclusions: 'required|array',
                exclusions: 'required|array',
                status: 'boolean'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            const getMaxPricePerKm = async (category) => {
                const result = await Vehicle.aggregate([
                    {
                        $match: { category: category }
                    },
                    {
                        $addFields: {
                            price_per_km_num: { $toDouble: "$price_per_km" }
                        }
                    },
                    {
                        $group: {
                            _id: "$category",
                            maxPricePerKm: { $max: "$price_per_km_num" }
                        }
                    }
                ]);

                return result.length > 0 ? result[0].maxPricePerKm : null;
            };

            if (typeof req.body.inclusions === 'string') {
                req.body.inclusions = JSON.parse(req.body.inclusions);
            }

            if (typeof req.body.exclusions === 'string') {
                req.body.exclusions = JSON.parse(req.body.exclusions);
            }
            const data = {
                from: req.body.from,
                to: req.body.to,
                pickup_location: req.body.pickup_location,
                drop_location: req.body.drop_location,
                Vehicle_category: req.body.vehicle_category,
                fuel_types: req.body.fuel_types,
                inclusions: req.body.inclusions,
                exclusions: req.body.exclusions,
                price_calculation: await getMaxPricePerKm(req.body.vehicle_category),
                status: typeof req.body.status === 'number' ? !!req.body.status : req.body.status,
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