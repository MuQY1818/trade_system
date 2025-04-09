import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 191 })
    username: string;

    @Column({ unique: true, length: 191 })
    email: string;

    @Column({ length: 191 })
    password: string;

    @Column()
    real_name: string;

    @Column({ default: 'user' })
    role: string; // admin, purchaser, salesperson, warehouse, finance

    @Column({ default: true })
    is_active: boolean;

    @Column({ nullable: true, type: 'datetime', default: null })
    last_login: Date;

    @CreateDateColumn({ type: 'datetime', precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', precision: 3 })
    updatedAt: Date;
} 