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
import { UserBooking } from "../../Models/UserBooking.mjs";

export class UserBookingController {

    static async getUsers(req, res) {
        try {

            let users = await UserBooking.find().lean();
            return success(res, "users List!",users);

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

}