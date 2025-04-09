import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({ where: { username } });
        
        if (!user) {
            throw new Error('用户不存在');
        }

        if (!user.is_active) {
            throw new Error('用户已被禁用');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('密码错误');
        }

        // 更新最后登录时间
        user.last_login = new Date();
        await this.userRepository.save(user);

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

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                real_name: user.real_name,
                role: user.role
            }
        };
    }

    async register(userData: {
        username: string;
        password: string;
        real_name: string;
        role: string;
    }) {
        const existingUser = await this.userRepository.findOne({
            where: { username: userData.username }
        });

        if (existingUser) {
            throw new Error('用户名已存在');
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            is_active: true
        });

        await this.userRepository.save(user);

        return {
            id: user.id,
            username: user.username,
            real_name: user.real_name,
            role: user.role
        };
    }
} 