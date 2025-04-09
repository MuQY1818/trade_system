import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
    // 用户登录
    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            console.log('登录请求数据:', { username, password });

            // 查找用户
            const user = await prisma.user.findUnique({
                where: { username }
            });

            if (!user) {
                return res.status(401).json({ message: '用户名或密码错误' });
            }

            // 验证密码
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: '用户名或密码错误' });
            }

            // 生成 JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                code: 200,
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                },
                message: '登录成功'
            });
        } catch (error: any) {
            console.error('登录错误:', error);
            res.status(500).json({ message: '服务器错误', error: error.message });
        }
    }

    // 用户注册
    static async register(req: Request, res: Response) {
        try {
            console.log('收到注册请求:', req.body);
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                console.error('注册数据不完整:', req.body);
                return res.status(400).json({ 
                    message: '注册信息不完整',
                    details: {
                        username: !username ? '用户名不能为空' : null,
                        password: !password ? '密码不能为空' : null,
                        email: !email ? '邮箱不能为空' : null
                    }
                });
            }

            // 检查用户是否已存在
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email }
                    ]
                }
            });

            if (existingUser) {
                console.log('用户已存在:', { username, email });
                return res.status(400).json({ 
                    message: '用户名或邮箱已被使用',
                    details: {
                        username: existingUser.username === username ? '用户名已存在' : null,
                        email: existingUser.email === email ? '邮箱已被使用' : null
                    }
                });
            }

            // 加密密码
            const hashedPassword = await bcrypt.hash(password, 10);

            // 创建新用户
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            });

            console.log('用户创建成功:', { id: newUser.id, username: newUser.username });

            // 生成 JWT token
            const token = jwt.sign(
                { userId: newUser.id, username: newUser.username },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: '注册成功',
                token,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        } catch (error: any) {
            console.error('注册错误:', error);
            res.status(500).json({ 
                message: '服务器错误', 
                error: error.message,
                details: error.stack
            });
        }
    }
} 