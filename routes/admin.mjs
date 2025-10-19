import express from 'express';
const adminRouter = express.Router();

import { CheckAuthMiddleware } from "../app/Middleware/CheckAuthMiddleware.mjs"
import { AuthController } from "../app/Controllers/Admin/AuthController.mjs";
import { VehicleController } from '../app/Controllers/Admin/VehicleController.mjs';
import { PackageController } from '../app/Controllers/Admin/PackageController.mjs';
import { UserBookingController } from '../app/Controllers/Admin/UserBookingController.mjs';



adminRouter.post("/login", AuthController.login);
adminRouter.post("/forgot/password/", AuthController.forgotPassword);
adminRouter.post("/update/password", AuthController.updatePassword);

adminRouter.get("/city-list", VehicleController.cityList);
adminRouter.get("/booking-export", UserBookingController.exportBookingDetails);


adminRouter.use(CheckAuthMiddleware);

adminRouter.post("/refresh/token", AuthController.refreshToken);



//Vehicle Api
adminRouter.post("/add-edit-vehicle", VehicleController.addEditVehicle);
adminRouter.get("/vehicle-listing", VehicleController.vehicleList);
adminRouter.get("/all-vehicles", VehicleController.allVehicles);
adminRouter.delete("/delete-vehicle", VehicleController.deleteVehicle);
adminRouter.post("/add-Edit-city", VehicleController.addEditCity);
adminRouter.get("/vehicle-category", VehicleController.categoryList);
adminRouter.post("/add-edit-category", VehicleController.addEditCategory);
adminRouter.delete("/delete-city", VehicleController.deleteCity);
adminRouter.delete("/delete-Category", VehicleController.deleteCategory);

//Package Api
adminRouter.post("/add-edit-package", PackageController.addEditPackage);
adminRouter.get("/package-listing", PackageController.packageList);
adminRouter.delete("/delete-package", PackageController.deletePackage);
adminRouter.post("/inactive-package", PackageController.inactivePackage);

//User Booking Api
adminRouter.get("/user-booking", UserBookingController.getUsers);

//Price Management Api
adminRouter.post("/add-edit-price", VehicleController.addEditPrice);
adminRouter.get("/price-listing", VehicleController.priceList);






export { adminRouter };
