import { Vehicle } from "../../Models/Vehicle.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { fileUpload } from "../../Helper/util.mjs";
import { category } from "../../../config/category.mjs";
import logger from '../../Helper/logger.mjs';
import mongoose from 'mongoose';
import { log } from "console";
import { type } from "os";
import { City } from "../../Models/City.mjs";
import { Category } from "../../Models/Category.mjs";

export class VehicleController {

    static async addEditVehicle(req, res) {
        try {
            const valid = new Validator(req.body, {
                city_name: 'required',
                vehicle_name: 'required',
                inclusions: 'required',
                exclusions: 'required',
                luggage: 'required',
                total_seat: 'required',
                price_per_km: 'required',
                gst: 'required',
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            try {
                req.body.vehicle_image = (req.files && req.files.vehicle_image ? fileUpload(req.files.vehicle_image) : null);
            } catch (fileError) {
                console.error('File upload error:', fileError.message);
            }

            if (typeof req.body.inclusions === 'string') {
                req.body.inclusions = JSON.parse(req.body.inclusions);
            }

            if (typeof req.body.exclusions === 'string') {
                req.body.exclusions = JSON.parse(req.body.exclusions);
            }


            if (req.body.vehicle_id) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.vehicle_id) };
                const existingVehicle = await Vehicle.findOne(filter);
                if (!existingVehicle) {
                    return customValidationFailed(res, 'Vehicle not found', 404);
                }

                await Vehicle.findOneAndUpdate(filter, req.body);
                return success(res, "vehicle updated successfully!");
            } else {

                await Vehicle.create(req.body);
                return success(res, "Vehicle added successfully!");
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async vehicleList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const type = req.query.type;

            let query = {};

            const listing = await Vehicle.paginate(query, {
                page,
                limit,
                sort: { createdAt: 1 }
            });
            const base_url = process.env.BASE_URL
            // Append base_url to vehicle_image
            listing.docs = listing.docs.map(vehicle => {
                vehicle.vehicle_image = vehicle.vehicle_image
                    ? `${base_url}admin/${vehicle.vehicle_image}`
                    : null;
                return vehicle;
            });

            return success(res, "vehicle list", listing, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async deleteVehicle(req, res) {
        try {
            const { vehicle_id } = req.query;
            if (!vehicle_id) {
                return customValidationFailed(res, 400, 'Vehicle Id not found', {});
            }
            const deletedVehicle = await Vehicle.findByIdAndDelete(vehicle_id);
            if (!deletedVehicle) {
                return customValidationFailed(res, 400, 'Vehicle Id not found', {});
            }

            return success(res, "Vehicle deleted successfully", {}, 200);
        } catch (error) {
            console.error("Delete Vehicle Error:", error);
            return failed(res, {}, error.message || "Something went wrong", 500);
        }
    }


    static async categories(req, res) {
        try {
            return success(res, 'category list', category, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async cityList(req, res) {
        try {
            var cities = await City.find({}, { name: 1 }).lean();
            return success(res, 'city list', cities, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async addEditCity(req, res) {
        try {
            // if (req.body.name) {
            //     req.body.name =
            //         req.body.name.charAt(0).toUpperCase() +
            //         req.body.name.slice(1).toLowerCase();
            // }
            const valid = new Validator(req.body, {
                name: 'required'
            });
            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            if (req.body.city_id) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.city_id) };
                const existingCity = await City.findOne(filter);
                if (!existingCity) {
                    return customValidationFailed(res, 'City not found', 404);
                }
                await City.findOneAndUpdate(filter, req.body);
                return success(res, "City updated successfully!");
            } else {
                await City.create(req.body);
                return success(res, "City added successfully!");
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async categoryList(req, res) {
        try {
            var categories = await Category.find({}, { name: 1 }).lean();
            return success(res, 'category list', categories, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async addEditCategory(req, res) {
        try {
            const valid = new Validator(req.body, {
                name: 'required'
            });
            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            if (req.body.category_id) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.category_id) };
                const existingCategory = await Category.findOne(filter);
                if (!existingCategory) {
                    return customValidationFailed(res, 'Category not found', 404);
                }
                await Category.findOneAndUpdate(filter, req.body);
                return success(res, "category updated successfully!");
            } else {
                await Category.create(req.body);
                return success(res, "category added successfully!");
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async deleteCity(req, res) {
        try {
            const { city_id } = req.query;
            if (!city_id) {
                return customValidationFailed(res, 400, 'city Id not found', {});
            }
            const deletedCity = await City.findByIdAndDelete(city_id);
            if (!deletedCity) {
                return customValidationFailed(res, 400, 'City not found', {});
            }
            return success(res, "City deleted successfully", {}, 200);
        } catch (error) {
            console.error("Delete City Error:", error);
            return failed(res, {}, error.message || "Something went wrong", 500);
        }
    }
    static async deleteCategory(req, res) {
        try {
            const { category_id } = req.query;
            if (!category_id) {
                return customValidationFailed(res, 400, 'Category Id not found', {});
            }
            const deletedCategory = await Category.findByIdAndDelete(category_id);
            if (!deletedCategory) {
                return customValidationFailed(res, 400, 'Category not found', {});
            }

            return success(res, "Category deleted successfully", {}, 200);
        } catch (error) {
            console.error("Delete Category Error:", error);
            return failed(res, {}, error.message || "Something went wrong", 500);
        }
    }

    static async addEditPrice(req, res) {
        try {
            const valid = new Validator(req.body, {
                vehicle_id: 'required',
                price_per_km: 'required',
                total_seat: 'required',
                luggage: 'required',
                fuel_type: 'required',
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            if (req.body.vehicle_id) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.vehicle_id) };
                const existingVehicle = await Vehicle.findOne(filter);
                if (!existingVehicle) {
                    return customValidationFailed(res, 'Vehicle not found', 404);
                }

                await Vehicle.findOneAndUpdate(filter, req.body);
                return success(res, "vehicle updated successfully!");
            } else {
                await Vehicle.findOneAndUpdate(req.body);
                return success(res, "Vehicle added successfully!");
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async priceList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const type = req.query.type;

            let query = {};

            const listing = await Vehicle.paginate(query, {
                page,
                limit,
                sort: { createdAt: 1 },
                select: "vehicle_name category fuel_type price_per_km total_seat luggage"
            });

            return success(res, "vehicle list", listing, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async allVehicles(req, res) {
        try {
            const vehicles = await Vehicle.find({}, { _id: 1, vehicle_name: 1 }).lean();
            return success(res, 'vehicle list', vehicles, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

}