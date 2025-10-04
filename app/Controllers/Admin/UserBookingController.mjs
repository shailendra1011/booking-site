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
            const page = parseInt(req.query.page) || 1; // current page
            const limit = parseInt(req.query.limit) || 10; // records per page
            const skip = (page - 1) * limit;

            const users = await UserBooking.find()
                .skip(skip)
                .limit(limit)
                .lean();

            const today = moment();
            users.forEach(user => {
                const created_date = moment(user.createdAt);
                user.delete_booking = `${today.diff(created_date, "days")} days ago to delete these data`;
            });

            const total = await UserBooking.countDocuments();

            return success(res, "Users List!", {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
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