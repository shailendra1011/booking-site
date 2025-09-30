import express from 'express';
const adminRouter = express.Router();

import { CheckAuthMiddleware } from "../app/Middleware/CheckAuthMiddleware.mjs"
import { AuthController } from "../app/Controllers/Admin/AuthController.mjs";
import { VehicleController } from '../app/Controllers/Admin/VehicleController.mjs';
import { PackageController } from '../app/Controllers/Admin/PackageController.mjs';



adminRouter.post("/login", AuthController.login);
adminRouter.post("/forgot/password/", AuthController.forgotPassword);
adminRouter.post("/update/password", AuthController.updatePassword);

adminRouter.use(CheckAuthMiddleware);

adminRouter.post("/refresh/token", AuthController.refreshToken);

//Vehicle Api
adminRouter.get("/vehicle-category", VehicleController.categories);


//Vehicle Api
adminRouter.post("/add-edit-vehicle", VehicleController.addEditVehicle);
adminRouter.post("/add-city", VehicleController.addCity);
adminRouter.get("/vehicle-listing", VehicleController.vehicleList);
adminRouter.delete("/delete-vehicle", VehicleController.deleteVehicle);
adminRouter.get("/city-list", VehicleController.cityList);

//Package Api
adminRouter.post("/add-edit-package", PackageController.addEditPackage);
adminRouter.get("/package-listing", PackageController.packageList);
adminRouter.delete("/delete-package", PackageController.deletePackage);
adminRouter.post("/inactive-package", PackageController.inactivePackage);

//Price Management Api
adminRouter.post("/add-edit-price", VehicleController.addEditPrice);
adminRouter.get("/price-listing", VehicleController.priceList);






export { adminRouter };
