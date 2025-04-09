import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
    async register(userData: {
        username: string;
        password: string;
        real_name: string;
        role: string;
    }) {
        try {
            console.log("开始注册流程，用户数据：", { ...userData, password: "***" });
            
            // 检查用户名是否已存在
            const existingUser = await userRepository.findOne({
                where: { username: userData.username }
            });

            if (existingUser) {
                console.log("用户名已存在：", userData.username);
                throw new Error("用户名已存在");
            }

            // 密码加密
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            console.log("密码加密完成");

            // 创建新用户
            const newUser = userRepository.create({
                username: userData.username,
                password: hashedPassword,
                real_name: userData.real_name,
                role: userData.role
            });

            // 保存用户
            await userRepository.save(newUser);
            console.log("新用户创建成功：", { id: newUser.id, username: newUser.username });

            return {
                id: newUser.id,
                username: newUser.username,
                real_name: newUser.real_name,
                role: newUser.role
            };
        } catch (error) {
            console.error("注册过程出错：", error);
            throw error;
        }
    }

    async login(username: string, password: string) {
        try {
            console.log("开始登录流程，用户名：", username);
            
            // 查找用户
            const user = await userRepository.findOne({
                where: { username }
            });

            if (!user) {
                console.log("用户不存在：", username);
                throw new Error("用户不存在");
            }

            console.log("找到用户，开始验证密码");
            
            // 验证密码
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log("密码验证结果：", isValidPassword);
            
            if (!isValidPassword) {
                console.log("密码错误");
                throw new Error("密码错误");
            }

            // 生成 JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            console.log("登录成功，已生成token");

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    real_name: user.real_name,
                    role: user.role
                }
            };
        } catch (error) {
            console.error("登录过程出错：", error);
            throw error;
        }
    }

    async findById(id: number) {
        const user = await userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new Error("用户不存在");
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(id: number, userData: Partial<User>) {
        const user = await userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new Error("用户不存在");
        }

        // 如果要更新密码，需要加密
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // 更新用户信息
        Object.assign(user, userData);
        await userRepository.save(user);

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
} 