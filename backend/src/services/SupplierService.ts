import { prisma } from '../app';

export class SupplierService {
    async findAll(query: any) {
        const { supplier_name, product_category, contact_person, page = 1, pageSize = 10 } = query;
        
        const where: any = {};
        if (supplier_name) {
            where.supplier_name = { contains: supplier_name };
        }
        if (contact_person) {
            where.contact_person = { contains: contact_person };
        }
        if (product_category) {
            where.product_category = { contains: product_category };
        }

        const skip = (page - 1) * pageSize;
        
        const [suppliers, total] = await Promise.all([
            prisma.supplier.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { id: 'desc' }
            }),
            prisma.supplier.count({ where })
        ]);

        return {
            items: suppliers,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        };
    }

    async findOne(id: number) {
        const supplier = await prisma.supplier.findUnique({
            where: { id }
        });

        if (!supplier) {
            throw new Error('供应商不存在');
        }

        return supplier;
    }

    async create(data: any) {
        return prisma.supplier.create({
            data
        });
    }

    async update(id: number, data: any) {
        return prisma.supplier.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return prisma.supplier.delete({
            where: { id }
        });
    }
} 