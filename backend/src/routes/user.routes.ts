import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

// 需要认证的路由
router.use(authMiddleware);
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

export default router; 