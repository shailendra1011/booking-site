import express from 'express';
const adminRouter = express.Router();

import { CheckAuthMiddleware } from "../app/Middleware/CheckAuthMiddleware.mjs"
import { TaxonomyController } from "../app/Controllers/Admin/TaxonomyController.mjs";
import { AuthController } from "../app/Controllers/Admin/AuthController.mjs";
import { VehicleController } from '../app/Controllers/Admin/VehicleController.mjs';
import { PackageController } from '../app/Controllers/Admin/PackageController.mjs';



adminRouter.post("/login", AuthController.login);
adminRouter.post("/forgot/password/", AuthController.forgotPassword);
adminRouter.post("/update/password", AuthController.updatePassword);

// adminRouter.use(CheckAuthMiddleware);

adminRouter.post("/refresh/token", AuthController.refreshToken);

//Vehicle Api
adminRouter.get("/vehicle-category", VehicleController.categories);


//Vehicle Api
adminRouter.post("/add-edit-vehicle", VehicleController.addEditVehicle);
adminRouter.get("/vehicle-listing", VehicleController.vehicleList);
adminRouter.get("/delete-vehicle", VehicleController.deleteVehicle);

//Package Api
adminRouter.get("/add-edit-package", PackageController.addEditPackage);
adminRouter.get("/package-listing", PackageController.packageList);
adminRouter.get("/delete-package", PackageController.deletePackage);

//Price Management Api
adminRouter.get("/add-edit-price", VehicleController.addEditPrice);
adminRouter.get("/price-listing", VehicleController.priceList);






export { adminRouter };
