import { prisma } from '../app';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductService {
    async findAll(query: any) {
        const { 
            code,
            name,
            category,
            status,
            page = 1, 
            pageSize = 10 
        } = query;
        
        const where: any = {};
        
        if (code) {
            where.code = { contains: code };
        }
        if (name) {
            where.name = { contains: name };
        }
        if (category) {
            where.category = { equals: category };
        }
        if (status) {
            where.status = { equals: status };
        }

        const skip = (page - 1) * pageSize;
        
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { id: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        return {
            items: products,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        };
    }

    async findOne(id: number) {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            throw new Error('商品不存在');
        }

        return product;
    }

    async create(data: any) {
        // 检查商品编码是否已存在
        const existingProduct = await prisma.product.findUnique({
            where: { code: data.code }
        });

        if (existingProduct) {
            throw new Error('商品编码已存在');
        }

        return prisma.product.create({
            data: {
                ...data,
                price: new Decimal(data.price),
                cost: new Decimal(data.cost)
            }
        });
    }

    async update(id: number, data: any) {
        // 如果更新了商品编码，需要检查是否与其他商品重复
        if (data.code) {
            const existingProduct = await prisma.product.findFirst({
                where: {
                    code: data.code,
                    NOT: {
                        id: id
                    }
                }
            });

            if (existingProduct) {
                throw new Error('商品编码已存在');
            }
        }

        const updateData = { ...data };
        if (data.price) {
            updateData.price = new Decimal(data.price);
        }
        if (data.cost) {
            updateData.cost = new Decimal(data.cost);
        }

        return prisma.product.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: number) {
        // 检查商品是否可以删除（这里可以添加更多的业务逻辑）
        const product = await this.findOne(id);
        
        if (product.current_stock > 0) {
            throw new Error('商品还有库存，不能删除');
        }

        return prisma.product.delete({
            where: { id }
        });
    }

    // 获取所有商品分类
    async getCategories() {
        const products = await prisma.product.findMany({
            select: {
                category: true
            },
            distinct: ['category']
        });

        return products.map(p => p.category);
    }

    // 更新商品库存
    async updateStock(id: number, quantity: number) {
        const product = await this.findOne(id);
        const newStock = product.current_stock + quantity;

        if (newStock < 0) {
            throw new Error('库存不足');
        }

        return prisma.product.update({
            where: { id },
            data: {
                current_stock: newStock
            }
        });
    }
} 