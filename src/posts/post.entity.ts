import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { postType } from './enums/postType.enum';
import { postStatus } from './enums/postStatus.enum';
import { MetaOption } from "src/meta-options/meta-option.entity";
import { User } from "src/users/user.entity";
import { Tag } from "src/tags/tag.entity";
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false
    })
    title: string;

    @Column({
        type: 'enum',
        enum: postType,
        nullable: false,
        default: postType.POST
    })
    postType: postType;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
        unique: true
    })
    slug: string;

    @Column({
        type: 'enum',
        enum: postStatus,
        nullable: false,
        default: postStatus.DRAFT
    })
    status: postStatus;

    @Column({
        type: 'text',
        nullable: false
    })
    content: string;

    @Column({
        type: 'text',
        nullable: true
    })
    schema?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    featuredImageUrl?: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    publishOn?: Date;

    @ManyToMany(() => Tag, (tag)=> tag.posts, {
        eager: true
    })
    @JoinTable()
    tags?: Tag[];

    @OneToOne(() => MetaOption, (metaOptions)=> metaOptions.post, {cascade: true, eager: true})
    @JoinColumn()
    metaOptions?: MetaOption;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

}