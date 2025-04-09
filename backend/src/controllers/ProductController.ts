import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
    private productService = new ProductService();

    async findAll(req: Request, res: Response) {
        try {
            const products = await this.productService.findAll(req.query);
            res.json({
                code: 200,
                data: products,
                message: "获取商品列表成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "获取商品列表失败",
                error: error.message || '未知错误'
            });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.findOne(id);
            res.json({
                code: 200,
                data: product,
                message: "获取商品详情成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "获取商品详情失败",
                error: error.message || '未知错误'
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const product = await this.productService.create(req.body);
            res.json({
                code: 200,
                data: product,
                message: "创建商品成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "创建商品失败",
                error: error.message || '未知错误'
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.update(id, req.body);
            res.json({
                code: 200,
                data: product,
                message: "更新商品成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "更新商品失败",
                error: error.message || '未知错误'
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.productService.delete(id);
            res.json({
                code: 200,
                message: "删除商品成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "删除商品失败",
                error: error.message || '未知错误'
            });
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const categories = await this.productService.getCategories();
            res.json({
                code: 200,
                data: categories,
                message: "获取商品分类成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "获取商品分类失败",
                error: error.message || '未知错误'
            });
        }
    }
} 