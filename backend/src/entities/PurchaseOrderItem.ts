import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PurchaseOrder } from "./PurchaseOrder";
import { Product } from "./Product";

@Entity()
export class PurchaseOrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PurchaseOrder)
    purchase_order: PurchaseOrder;

    @Column()
    purchase_order_id: number;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @Column({ type: 'text', nullable: true })
    remarks: string;
} 