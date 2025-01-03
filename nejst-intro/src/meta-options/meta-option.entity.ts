import { Post } from "src/posts/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MetaOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'json',
        nullable: false
    })
    metaValue: string;

    @CreateDateColumn()
    createDate: Date;

    @CreateDateColumn()
    updateDate: Date;


    @OneToOne(() => Post, (post) => post.metaOptions, {onDelete: 'CASCADE', createForeignKeyConstraints: true})
    @JoinColumn()
    post: Post
}