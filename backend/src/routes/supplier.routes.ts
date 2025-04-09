import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

const router = Router();
const supplierController = new SupplierController();

router.get("/suppliers", supplierController.findAll.bind(supplierController));
router.get("/suppliers/:id", supplierController.findOne.bind(supplierController));
router.post("/suppliers", supplierController.create.bind(supplierController));
router.put("/suppliers/:id", supplierController.update.bind(supplierController));
router.delete("/suppliers/:id", supplierController.delete.bind(supplierController));

export default router; 