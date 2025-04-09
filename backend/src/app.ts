import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supplierRoutes from "./routes/supplier.routes";
import authRoutes from './routes/auth';
import productRoutes from './routes/product.routes';
import { PrismaClient } from './generated/prisma';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 路由
app.use("/api", supplierRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

export default app; 