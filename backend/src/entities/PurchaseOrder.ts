import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Supplier } from "./Supplier";
import { PurchaseOrderItem } from "./PurchaseOrderItem";

@Entity()
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_number: string;

    @ManyToOne(() => Supplier)
    supplier: Supplier;

    @Column()
    supplier_id: number;

    @Column()
    order_date: Date;

    @Column()
    expected_delivery_date: Date;

    @Column()
    status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @OneToMany(() => PurchaseOrderItem, item => item.purchase_order)
    items: PurchaseOrderItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 