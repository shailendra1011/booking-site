import { Vehicle } from "../../Models/Vehicle.mjs";
import { Package } from "../../Models/Package.mjs";
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { UserBooking } from "../../Models/UserBooking.mjs";
import moment from "moment";
import fs from "fs";
import { Parser } from "json2csv";

export class UserBookingController {

    static async getUsers(req, res) {
        try {

            let users = await UserBooking.find().lean();
            const today = moment();
            users.forEach(user => {
                const created_date = moment(user.createdAt);
                user.delete_booking = `${today.diff(created_date, "days")} days ago to delete these data`;
            });
            return success(res, "users List!", users);

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async exportBookingDetails(req, res) {
        try {
            let users = await UserBooking.find().lean();

            const fields = ["_id", "bookingId", "email", "mobile", "createdAt"]; // choose columns
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(users);

            fs.writeFileSync("users.csv", csv);
            console.log("✅ Data exported to users.csv");

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

}