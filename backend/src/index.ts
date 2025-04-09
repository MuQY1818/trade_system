import dotenv from 'dotenv';

// 确保在最开始就加载环境变量
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3003;

// 打印环境变量（不包含敏感信息）
console.log('环境变量加载状态:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? '已设置' : '未设置'
});

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 