import { Vehicle } from "../../Models/Vehicle.mjs";
import { Package } from "../../Models/Package.mjs";
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { UserBooking } from "../../Models/UserBooking.mjs";
import moment from "moment";
import fs from "fs";
import { Parser } from 'json2csv';


export class UserBookingController {

    static async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // current page
            const limit = parseInt(req.query.limit) || 10; // records per page
            const skip = (page - 1) * limit;

            const users = await UserBooking.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const today = moment();
            users.forEach(user => {
                const created_date = moment(user.createdAt);
                user.delete_booking = `${90 - today.diff(created_date, "days")} days left to delete these data`;
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
            const { start_date, end_date } = req.query;
            const filter = {};

            if (start_date && end_date) {
                filter.createdAt = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date),
                };
            } else if (start_date) {
                filter.createdAt = { $gte: new Date(start_date) };
            } else if (end_date) {
                filter.createdAt = { $lte: new Date(end_date) };
            }

            const users = await UserBooking.find(filter)
                .sort({ createdAt: -1 })
                .lean();
            if (!users.length) {
                return res.status(404).json({
                    success: false,
                    message: "No bookings found for the given date range",
                });
            }

            const fields = [
                "_id",
                "bookingId",
                "booking_type",
                "name",
                "email",
                "mobile",
                "vehicle_name",
                "origin_city",
                "pickup_address",
                "drop_address",
                // "transfer_city",
                "booking_date",
                "total_price",
                "gst",
                "within_city_booking",
                "isReturn",
                "return_date",
                "km_in_hours",
                "flight_no",
                "travel_class",
                "note",
                "createdAt"
            ];

            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(users);

            // ✅ Set headers to force browser download
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=booking_details.csv");
            res.setHeader("X-Success-Message", "Booking details exported successfully!");

            // ✅ Send CSV content
            return res.status(200).send(csv);

        } catch (error) {
            console.error("❌ Error exporting CSV:", error);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }




}