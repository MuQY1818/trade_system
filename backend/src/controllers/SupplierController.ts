import { Request, Response } from "express";
import { SupplierService } from "../services/SupplierService";

export class SupplierController {
    private supplierService = new SupplierService();

    async findAll(req: Request, res: Response) {
        try {
            const suppliers = await this.supplierService.findAll(req.query);
            res.json({
                code: 200,
                data: suppliers,
                message: "获取供应商列表成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "获取供应商列表失败",
                error: error.message || '未知错误'
            });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const supplier = await this.supplierService.findOne(id);
            if (!supplier) {
                return res.status(404).json({
                    code: 404,
                    message: "供应商不存在"
                });
            }
            res.json({
                code: 200,
                data: supplier,
                message: "获取供应商详情成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "获取供应商详情失败",
                error: error.message || '未知错误'
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const supplier = await this.supplierService.create(req.body);
            res.json({
                code: 200,
                data: supplier,
                message: "创建供应商成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "创建供应商失败",
                error: error.message || '未知错误'
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const supplier = await this.supplierService.update(id, req.body);
            res.json({
                code: 200,
                data: supplier,
                message: "更新供应商成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "更新供应商失败",
                error: error.message || '未知错误'
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.supplierService.delete(id);
            res.json({
                code: 200,
                message: "删除供应商成功"
            });
        } catch (error: any) {
            res.status(500).json({
                code: 500,
                message: "删除供应商失败",
                error: error.message || '未知错误'
            });
        }
    }
} 