import { Vehicle } from "../../Models/Vehicle.mjs";
import { Package } from "../../Models/Package.mjs";
import { UserBooking } from "../../Models/UserBooking.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { bookingType } from "../../../config/bookingType.mjs";
import { getDistance } from "geolib";
import { sendOtp } from "../../Helper/sendOtp.mjs"
import { EmailOtp } from "../../Models/EmailOtp.mjs";

export class BookingController {

    static async bookingType(req, res) {
        try {
            return success(res, 'booking type', bookingType, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async vehiclePackageList(req, res) {
        try {
            const valid = new Validator(req.query, {
                booking_type: 'required',
                origin_city: 'required',
                // transfer_city: 'required',
                pickup_location_latitude: 'required',
                pickup_location_longitude: 'required',
                drop_location_latitude: 'required',
                drop_location_longitude: 'required',

            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            const point1 = { latitude: req.query.pickup_location_latitude, longitude: req.query.pickup_location_longitude }; // New Delhi
            const point2 = { latitude: req.query.drop_location_latitude, longitude: req.query.drop_location_longitude }; // Mumbai

            // getDistance returns meters
            const distance = Math.round((getDistance(point1, point2)) / 1000);
            let vehicles = [];
            let packages = [];
            const base_url = process.env.BASE_URL
            if (req.query.booking_type == 'Outstation') {
                packages = await Package.find(
                    { from: req.query.origin_city, price_calculation: { $ne: null } },
                    {
                        _id: 1, vehicle_category: 1, fuel_types: 1, inclusions: 1, exclusions: 1, price_calculation: 1
                    }
                ).lean();
                packages = packages.map(pkg => {
                    // ✅ Handle both `vehicle_category` and `Vehicle_category`
                    const categoryValue = pkg.vehicle_category || pkg.Vehicle_category;

                    if (categoryValue) {
                        pkg.category = categoryValue;
                    }

                    // ✅ Remove both variants if they exist
                    delete pkg.vehicle_category;
                    delete pkg.Vehicle_category;

                    return pkg;
                });

                for (const value of packages) {
                    const getVehicle = await Vehicle.findOne({ category: value.vehicle_category })
                        .sort({ price_per_km: -1 })
                        .exec();

                    value.estimated_price = value.price_calculation * distance;
                    value.vehicle_image = getVehicle && getVehicle.vehicle_image
                        ? `${base_url}admin/${getVehicle.vehicle_image}`
                        : null;
                    value.luggage = getVehicle ? getVehicle.luggage : null;
                    value.total_seat = getVehicle ? getVehicle.total_seat : null;
                    value.distance = distance;
                }
                packages.sort((a, b) => b.estimated_price - a.estimated_price);
                return success(res, "Package list", packages, 200);

            } else {
                vehicles = await Vehicle.find(
                    { price_per_km: { $ne: null } },
                    {
                        _id: 1, vehicle_name: 1, vehicle_image: 1, category: 1, fuel_type: 1, price_per_km: 1, total_seat: 1, luggage: 1, inclusions: 1, exclusions: 1
                    }
                ).lean();
                vehicles.forEach(vehicle => {
                    vehicle.estimated_price = vehicle.price_per_km * distance;
                    vehicle.vehicle_image = `${base_url}admin/${vehicle.vehicle_image}`;
                    vehicle.distance = distance;
                });
                vehicles.sort((a, b) => b.estimated_price - a.estimated_price);
                return success(res, "vehicle list", vehicles, 200);

            }

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async userBooking(req, res) {
        try {
            const valid = new Validator(req.body, {
                booking_type: 'required',
                email: 'required',
                mobile: 'required',
                vehicle_category: 'required',
                vehicle_package_id: 'required',
                origin_city: 'required',
                // transfer_city: 'required',
                pickup_address: 'required',
                drop_address: 'required',
                booking_date: 'required',
                total_price: 'required',
                isReturn: 'required'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            const bookingData = {
                ...req.body,
                bookingId: BookingController.generateBookingId()
            };

            let data = await UserBooking.create(bookingData);
            if (data) {
                return success(res, "Booking successful!", data);
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async sendOtp(req, res) {
        try {
            const valid = new Validator(req.body, {
                email: 'required|email'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);
            const otp = Math.floor(1000 + Math.random() * 9000);
            await EmailOtp.create({ email: req.body.email, otp: otp });
            sendOtp(req.body.email, otp);
            return success(res, "Otp sent!", {});
        }
        catch (error) {
            return failed(res, {}, error.message, 400);
        }

    }
    static async verifyOtp(req, res) {
        try {
            const valid = new Validator(req.body, {
                email: 'required|email',
                otp: 'required'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);
            const emailOtp = await EmailOtp.findOne({ email: req.body.email, otp: req.body.otp }).sort({ createdAt: -1 }).exec();
            if (!emailOtp) {
                return customFailedMessage(res, "Invalid OTP", 400);
            }
            const currentTime = new Date();
            const otpCreationTime = new Date(emailOtp.createdAt);
            const timeDifference = (currentTime - otpCreationTime) / (1000 * 60); // difference in minutes
            if (timeDifference > 10) { // assuming OTP is valid for 10 minutes
                return customFailedMessage(res, "OTP has expired", 400);
            }
            return success(res, "Email verified!", {});
        }
        catch (error) {
            return failed(res, {}, error.message, 400);
        }

    }

    static generateBookingId(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let bookingId = '';
        for (let i = 0; i < length; i++) {
            bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return bookingId;
    }


}