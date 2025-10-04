import express from 'express';
const apiRouter = express.Router();
import { failed } from '../app/Helper/response.mjs';

import { BookingController } from '../app/Controllers/Api/BookingController.mjs';

apiRouter.get("/booking-type", BookingController.bookingType);
apiRouter.get("/vehicle-package-list", BookingController.vehiclePackageList);
apiRouter.post("/user-booking", BookingController.userBooking);
apiRouter.post("/send-otp", BookingController.sendOtp);
apiRouter.post("/verify-otp", BookingController.verifyOtp);

apiRouter.use((req, res, next) => {
    return failed(res, "API endpoint not found", 404);
});
export { apiRouter };
