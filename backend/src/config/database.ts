import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Supplier } from "../entities/Supplier";
import { PurchaseOrder } from "../entities/PurchaseOrder";
import { PurchaseOrderItem } from "../entities/PurchaseOrderItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

dotenv.config();

console.log("数据库配置:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE
});

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: ["query", "error"],
    entities: [Supplier, PurchaseOrder, PurchaseOrderItem, Product, User],
    subscribers: [],
    migrations: [],
});

// 初始化数据库连接
AppDataSource.initialize()
    .then(() => {
        console.log("数据库连接成功");
    })
    .catch((error) => {
        console.error("数据库连接失败:", error);
    }); 