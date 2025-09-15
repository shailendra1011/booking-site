import { Vehicle } from "../../Models/Vehicle.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { fileUpload } from "../../Helper/util.mjs";
import { category } from "../../../config/category.mjs";
import logger from '../../Helper/logger.mjs';
import mongoose from 'mongoose';
import { log } from "console";
import { type } from "os";

export class VehicleController {

    static async addEditVehicle(req, res) {
        try {
            const valid = new Validator(req.body, {
                category: 'required',
                vehicle_name: 'required',
                vehicle_image: 'required',
                inclusions: 'required',
                exclusions: 'required',
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            if (req.body.vehicleId) {
                const filter = { _id: mongoose.Types.ObjectId(req.body.vehicleId) };
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

            return success(res, "vehicle list", listing, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async deleteVehicle(req, res) {
        try {
            Vehicle.deleteOne({ _id: req.body.vehicleId })
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async categories(req, res) {
        try {
            return success(res, 'category list', category, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
}