import { Vehicle } from "../../Models/Vehicle.mjs";
import { Package } from "../../Models/Package.mjs";
import { UserBooking } from "../../Models/UserBooking.mjs";
import { Validator } from 'node-input-validator';
import { success, failed, customValidationFailed, validationFailedRes, customFailedMessage } from "../../Helper/response.mjs";
import { bookingType } from "../../../config/bookingType.mjs";
import { getDistance } from "geolib";
import { sendOtp } from "../../Helper/sendOtp.mjs"
import { EmailOtp } from "../../Models/EmailOtp.mjs";
import { sendBill } from "../../Helper/sendBill.mjs";
import dayjs from "dayjs";
import { sendMobileOtp } from "../../Helper/sendMobileOtp.mjs";

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
                // pickup_location_latitude: 'required',
                // pickup_location_longitude: 'required',
                // drop_location_latitude: 'required',
                // drop_location_longitude: 'required',

            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            // const point1 = { latitude: req.query.pickup_location_latitude, longitude: req.query.pickup_location_longitude }; // New Delhi
            // const point2 = { latitude: req.query.drop_location_latitude, longitude: req.query.drop_location_longitude }; // Mumbai

            // getDistance returns meters
            // const distance = Math.round((getDistance(point1, point2)) / 1000);
            const distance = 0;
            let vehicles = [];
            let packages = [];
            const base_url = process.env.BASE_URL
            const today = new Date()
            if (req.query.booking_type == 'Outstation') {
                const filter = {
                    service_type: req.query.booking_type,
                    from_city: req.query.origin_city,
                    from_date: { $lte: today },
                    to_date: { $gte: today },
                    status: true,
                };
                if (req.query.transfer_city) {
                    filter["to_city.city"] = req.query.transfer_city;
                }
                packages = await Package.find(
                    filter,
                    {
                        _id: 1, vehicle_name: 1, service_type: 1, package_name: 1, from_city: 1, to_city: 1, inclusions: 1, exclusions: 1, price: 1, km_in_hours: 1, total_km: 1, gst: 1, from_date: 1, to_date: 1, additional_notes: 1
                    }
                ).lean();

                for (const value of packages) {
                    const getVehicle = await Vehicle.findOne({ vehicle_name: value.vehicle_name, city_name: req.query.origin_city }).lean();

                    value.vehicle_image = getVehicle && getVehicle.vehicle_image
                        ? `${base_url}admin/${getVehicle.vehicle_image}`
                        : null;
                    value.luggage = getVehicle ? getVehicle.luggage : null;
                    value.total_seat = getVehicle ? getVehicle.total_seat : null;
                    value.distance = distance ? distance : null;
                }
                packages.sort((a, b) => b.price - a.price);
                return success(res, "Package list", packages, 200);

            } else {
                const filter = {
                    service_type: req.query.booking_type,
                    from_city: req.query.origin_city,
                    from_date: { $lte: today }, // from_date <= today
                    to_date: { $gte: today }    // to_date >= today
                };

                // apply transfer_city only if it is passed in query
                if (req.query.transfer_city) {
                    filter["to_city.city"] = req.query.transfer_city;
                }
                packages = await Package.find(
                    filter,
                    {
                        _id: 1, vehicle_name: 1, service_type: 1, package_name: 1, from_city: 1, to_city: 1, inclusions: 1, exclusions: 1, price: 1, km_in_hours: 1, total_km: 1, gst: 1, from_date: 1, to_date: 1, additional_notes: 1
                    }
                ).lean();
                if (packages.length != 0) {
                    for (const value of packages) {
                        const getVehicle = await Vehicle.findOne({ vehicle_name: value.vehicle_name, city_name: req.query.origin_city }).lean();

                        value.vehicle_image = getVehicle && getVehicle.vehicle_image
                            ? `${base_url}admin/${getVehicle.vehicle_image}`
                            : null;
                        value.luggage = getVehicle ? getVehicle.luggage : null;
                        value.total_seat = getVehicle ? getVehicle.total_seat : null;
                        value.distance = distance ? distance : null;
                    }
                    packages.sort((a, b) => b.price - a.price);
                    return success(res, "Package list", packages, 200);
                } else {
                    return success(res, "Package list", [], 200);

                    // vehicles = await Vehicle.find(
                    //     { city_name: req.query.origin_city },
                    //     {
                    //         _id: 1, vehicle_name: 1, vehicle_image: 1, price_per_km: 1, total_seat: 1, luggage: 1, inclusions: 1, exclusions: 1, additional_notes: 1, gst: 1
                    //     }
                    // ).lean();
                    // vehicles.forEach(vehicle => {
                    //     vehicle.price = vehicle.price_per_km * distance;
                    //     vehicle.vehicle_image = `${base_url}admin/${vehicle.vehicle_image}`;
                    //     vehicle.distance = distance;
                    // });
                    // vehicles.sort((a, b) => b.estimated_price - a.estimated_price);
                    // return success(res, "vehicle list", vehicles, 200);
                }

            }

        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async kmInHours(req, res) {
        try {
            let km_in_hours = await Package.aggregate([
                {
                    $match: {
                        service_type: req.query.service_type,
                        from_city: req.query.origin_city,
                        status: true,
                        km_in_hours: { $ne: null }
                    }
                },
                {
                    $group: {
                        _id: "$km_in_hours",
                        doc: { $first: "$$ROOT" } // keep the first full document per unique km_in_hours
                    }
                },
                {
                    $replaceRoot: { newRoot: "$doc" } // flatten the structure
                },
                {
                    $project: {
                        _id: 1,
                        km_in_hours: 1
                    }
                }
            ]);

            return success(res, 'km in hours dropdown', km_in_hours, 200);

            // let km_in_hours = await Package.find({ service_type: req.query.service_type, from_city: req.query.origin_city, status: true, km_in_hours: { $ne: null } }, { km_in_hours: 1 }).lean();
            // return success(res, 'km in hours dropdown', km_in_hours, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async vehicleNames(req, res) {
        try {
            let vehicle_names = await Package.find({ service_type: req.query.service_type, from_city: req.query.origin_city, km_in_hours: req.query.km_in_hours }, { vehicle_name: 1 }).lean();
            return success(res, 'vehicle name dropdown', vehicle_names, 200);
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }
    static async withInCityPackage(req, res) {
        try {
            let packages = [];
            let vehicles = [];
            const base_url = process.env.BASE_URL
            const today = new Date()
            const point1 = { latitude: req.query.pickup_location_latitude, longitude: req.query.pickup_location_longitude }; // New Delhi
            const point2 = { latitude: req.query.drop_location_latitude, longitude: req.query.drop_location_longitude }; // Mumbai

            // getDistance returns meters
            const distance = Math.round((getDistance(point1, point2)) / 1000);
            packages = await Package.find(
                {
                    service_type: req.query.booking_type,
                    from_city: req.query.origin_city,
                    // to_city: req.query.to_city,
                    km_in_hours: req.query.km_in_hours,
                    from_date: { $lte: today }, // from_date <= today
                    to_date: { $gte: today },    // to_date >= today
                    status: true
                },
                {
                    _id: 1, vehicle_name: 1, service_type: 1, package_name: 1, from_city: 1, to_city: 1, inclusions: 1, exclusions: 1, price: 1, km_in_hours: 1, total_km: 1, gst: 1, from_date: 1, to_date: 1, additional_notes: 1
                }
            ).lean();

            if (packages.length != 0) {
                for (const value of packages) {
                    const getVehicle = await Vehicle.findOne({ vehicle_name: value.vehicle_name, city_name: req.query.origin_city }).lean();

                    value.vehicle_image = getVehicle && getVehicle.vehicle_image
                        ? `${base_url}admin/${getVehicle.vehicle_image}`
                        : null;
                    value.luggage = getVehicle ? getVehicle.luggage : null;
                    value.total_seat = getVehicle ? getVehicle.total_seat : null;
                    value.distance = distance ? distance : null;
                }
                packages.sort((a, b) => b.price - a.price);
                return success(res, "Package list", packages, 200);
            } else {
                return success(res, "Package list", [], 200);
            }
        } catch (error) {
            return failed(res, {}, error.message, 400);
        }
    }

    static async userBooking(req, res) {
        try {
            const valid = new Validator(req.body, {
                booking_type: 'required',
                name: 'required',
                email: 'required',
                mobile: 'required',
                vehicle_name: 'required',
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
            // console.log(bookingData);

            let data = await UserBooking.create(bookingData);
            await sendBill(bookingData);
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
                email: 'required|email',
                mobile: 'required'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);

            var mobile_otp = null;
            var email_otp = null;
            if (req.body.email) {
                email_otp = Math.floor(1000 + Math.random() * 9000);
                sendOtp(req.body.email, email_otp);
            }
            if (req.body.mobile) {
                mobile_otp = 1234
                // mobile_otp = Math.floor(1000 + Math.random() * 9000);
                // const res = await sendMobileOtp(req.body.mobile, mobile_otp);
                // console.log(res);

            }
            await EmailOtp.create({ email: req.body.email, mobile: req.body.mobile, email_otp: email_otp, mobile_otp: mobile_otp });
            return success(res, "Otp sent!", {});
        }
        catch (error) {
            console.error("OTP sending/creation failed:", error.message);
            return failed(res, {}, `Failed to send OTP."${error.message}`, 500);
        }
    }

    static async verifyOtp(req, res) {
        try {
            const valid = new Validator(req.body, {
                email: 'required|email',
                mobile: 'required',
                email_otp: 'required',
                mobile_otp: 'required'
            });

            const matched = await valid.check();
            if (!matched) return validationFailedRes(res, valid);
            const emailOtp = await EmailOtp.findOne({ email: req.body.email, mobile: req.body.mobile, email_otp: req.body.email_otp, mobile_otp: req.body.mobile_otp }).sort({ createdAt: -1 }).exec();
            if (!emailOtp) {
                return customFailedMessage(res, "Invalid OTP", 400);
            }
            const currentTime = new Date();
            const otpCreationTime = new Date(emailOtp.createdAt);
            const timeDifference = (currentTime - otpCreationTime) / (1000 * 60); // difference in minutes
            if (timeDifference > 10) { // assuming OTP is valid for 10 minutes
                return customFailedMessage(res, "OTP has expired", 400);
            }
            return success(res, "OTP verified!", {});
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