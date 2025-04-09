import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    private userService = new UserService();

    async register(req: Request, res: Response) {
        try {
            const user = await this.userService.register(req.body);
            res.json({
                code: 200,
                data: user,
                message: "注册成功"
            });
        } catch (error: any) {
            res.status(400).json({
                code: 400,
                message: "注册失败",
                error: error.message || "未知错误"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await this.userService.login(username, password);
            res.json({
                code: 200,
                data: result,
                message: "登录成功"
            });
        } catch (error: any) {
            res.status(401).json({
                code: 401,
                message: "登录失败",
                error: error.message || "未知错误"
            });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id; // 从JWT中获取
            const user = await this.userService.findById(userId);
            res.json({
                code: 200,
                data: user,
                message: "获取用户信息成功"
            });
        } catch (error: any) {
            res.status(400).json({
                code: 400,
                message: "获取用户信息失败",
                error: error.message || "未知错误"
            });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id; // 从JWT中获取
            const user = await this.userService.updateProfile(userId, req.body);
            res.json({
                code: 200,
                data: user,
                message: "更新用户信息成功"
            });
        } catch (error: any) {
            res.status(400).json({
                code: 400,
                message: "更新用户信息失败",
                error: error.message || "未知错误"
            });
        }
    }
} 