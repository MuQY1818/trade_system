import { prisma } from '../app';

export class SupplierService {
    async findAll(query: any) {
        const { name, contact, phone, page = 1, pageSize = 10 } = query;
        
        const where: any = {};
        if (name) {
            where.name = { contains: name };
        }
        if (contact) {
            where.contact = { contains: contact };
        }
        if (phone) {
            where.phone = { contains: phone };
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
        return prisma.supplier.findUnique({
            where: { id }
        });
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