import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// 登录路由
router.post('/login', AuthController.login);

// 注册路由
router.post('/register', AuthController.register);

export default router; 