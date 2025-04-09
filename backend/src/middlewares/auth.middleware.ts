import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 定义自定义错误类型
enum AuthErrorType {
    NO_TOKEN = "NO_TOKEN",
    INVALID_FORMAT = "INVALID_FORMAT",
    INVALID_TOKEN = "INVALID_TOKEN",
    NO_PERMISSION = "NO_PERMISSION"
}

interface AuthError {
    type: AuthErrorType;
    message: string;
    statusCode: number;
}

// 扩展请求类型
interface CustomRequest extends Request {
    user?: {
        userId: number;
        username: string;
        role: string;
        iat?: number;
        exp?: number;
    };
}

// 错误处理函数
const handleAuthError = (error: AuthError): { statusCode: number; body: { code: number; message: string } } => {
    return {
        statusCode: error.statusCode,
        body: {
            code: error.statusCode,
            message: error.message
        }
    };
};

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        console.log('认证中间件开始处理请求:', {
            path: req.path,
            method: req.method,
            headers: {
                ...req.headers,
                authorization: req.headers.authorization ? '(已提供)' : '(未提供)'
            }
        });

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('未提供认证token - 请求头中没有Authorization');
            const error: AuthError = {
                type: AuthErrorType.NO_TOKEN,
                message: "未提供认证token",
                statusCode: 401
            };
            const { statusCode, body } = handleAuthError(error);
            return res.status(statusCode).json(body);
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            console.log('token格式错误 - Authorization头格式应为: Bearer <token>');
            const error: AuthError = {
                type: AuthErrorType.INVALID_FORMAT,
                message: "token格式错误",
                statusCode: 401
            };
            const { statusCode, body } = handleAuthError(error);
            return res.status(statusCode).json(body);
        }

        const token = parts[1];
        console.log('收到的token:', token);

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET环境变量未设置');
            throw new Error("JWT_SECRET环境变量未设置");
        }

        console.log('使用的JWT_SECRET:', secret);
        try {
            const decoded = jwt.verify(token, secret) as {
                userId: number;
                username: string;
                role: string;
                iat: number;
                exp: number;
            };
            console.log('token验证成功，解码后的用户信息:', {
                userId: decoded.userId,
                username: decoded.username,
                role: decoded.role,
                iat: decoded.iat,
                exp: decoded.exp
            });
            
            req.user = decoded;
            next();
        } catch (jwtError: any) {
            console.error('JWT验证失败:', {
                name: jwtError.name,
                message: jwtError.message,
                expiredAt: jwtError.expiredAt
            });
            throw jwtError;
        }
    } catch (error) {
        console.error('token验证失败:', error);
        const authError: AuthError = {
            type: AuthErrorType.INVALID_TOKEN,
            message: "无效的token",
            statusCode: 401
        };
        const { statusCode, body } = handleAuthError(authError);
        return res.status(statusCode).json(body);
    }
};

export const roleMiddleware = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            if (!user || !user.role) {
                const error: AuthError = {
                    type: AuthErrorType.INVALID_TOKEN,
                    message: "用户信息不完整",
                    statusCode: 401
                };
                const { statusCode, body } = handleAuthError(error);
                return res.status(statusCode).json(body);
            }

            if (!roles.includes(user.role)) {
                const error: AuthError = {
                    type: AuthErrorType.NO_PERMISSION,
                    message: "没有权限访问此资源",
                    statusCode: 403
                };
                const { statusCode, body } = handleAuthError(error);
                return res.status(statusCode).json(body);
            }
            
            next();
        } catch (error) {
            const authError: AuthError = {
                type: AuthErrorType.NO_PERMISSION,
                message: "权限验证失败",
                statusCode: 403
            };
            const { statusCode, body } = handleAuthError(authError);
            return res.status(statusCode).json(body);
        }
    };
};
