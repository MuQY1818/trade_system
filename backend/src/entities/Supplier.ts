import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    supplier_name: string;

    @Column()
    contact_person: string;

    @Column()
    contact_phone: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    product_category: string;

    @Column()
    credit_rating: string;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 