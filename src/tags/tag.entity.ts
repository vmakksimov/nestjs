import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 256,
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 512,
        nullable: true,
        unique: true
    })
    slug: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description?: string;

    @Column({
        type: 'varchar',
        length: 256,
        nullable: true
    })
    schema?: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: true
    })
    featuredImageUrl?: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createDate: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updateDate: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleteDate: Date;
}