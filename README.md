# 贸易管理系统

一个基于Vue 3 + Node.js的全栈贸易管理系统，使用TypeScript开发，提供商品管理、供应商管理等功能。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Element Plus
- Vue Router
- Axios
- Vite

### 后端
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT认证
- bcrypt加密

## 功能特性

- 用户认证
  - 登录/注册
  - JWT token认证
  - 基于角色的权限控制

- 商品管理
  - 商品列表展示
  - 商品添加/编辑/删除
  - 商品分类管理
  - 库存管理
  - 条件筛选

- 供应商管理
  - 供应商列表
  - 供应商信息管理
  - 供应商状态管理

## 项目结构

```
├── frontend/                # 前端项目目录
│   ├── src/
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 公共组件
│   │   ├── layouts/        # 布局组件
│   │   ├── router/         # 路由配置
│   │   ├── utils/          # 工具函数
│   │   ├── views/          # 页面组件
│   │   └── App.vue         # 根组件
│   └── package.json
│
├── backend/                 # 后端项目目录
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── entities/       # 数据实体
│   │   ├── middlewares/    # 中间件
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   └── app.ts          # 应用入口
│   └── package.json
```

## 环境要求

- Node.js >= 14
- PostgreSQL >= 12
- npm >= 6

## 安装和运行

### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量，创建 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=trade_system

# JWT配置
JWT_SECRET=your_jwt_secret_key

# 服务器配置
PORT=3002
```

4. 运行数据库迁移：
```bash
npx prisma migrate dev
```

5. 启动后端服务：
```bash
npm run dev
```

### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## API文档

### 认证接口

- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册

### 商品接口

- GET `/api/products` - 获取商品列表
- GET `/api/products/:id` - 获取商品详情
- POST `/api/products` - 创建商品
- PUT `/api/products/:id` - 更新商品
- DELETE `/api/products/:id` - 删除商品
- GET `/api/product-categories` - 获取商品分类

### 供应商接口

- GET `/api/suppliers` - 获取供应商列表
- GET `/api/suppliers/:id` - 获取供应商详情
- POST `/api/suppliers` - 创建供应商
- PUT `/api/suppliers/:id` - 更新供应商
- DELETE `/api/suppliers/:id` - 删除供应商

## 开发规范

- 使用TypeScript进行开发
- 遵循ESLint规范
- 使用Prettier进行代码格式化
- 遵循RESTful API设计规范
- 使用统一的错误处理机制
- 添加适当的日志记录

## 安全性

- 使用bcrypt进行密码加密
- 使用JWT进行身份验证
- 实现了基于角色的访问控制
- 防止SQL注入（使用Prisma ORM）
- 实现了CORS保护

## 贡献指南

1. Fork本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License 