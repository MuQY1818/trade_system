import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

// 需要认证的路由
router.use(authMiddleware);

// 获取商品列表
router.get("/products", productController.findAll.bind(productController));

// 获取商品详情
router.get("/products/:id", productController.findOne.bind(productController));

// 创建商品
router.post("/products", productController.create.bind(productController));

// 更新商品
router.put("/products/:id", productController.update.bind(productController));

// 删除商品
router.delete("/products/:id", productController.delete.bind(productController));

// 获取商品分类
router.get("/product-categories", productController.getCategories.bind(productController));

export default router; 