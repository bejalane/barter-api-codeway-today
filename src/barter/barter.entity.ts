import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity('barter')
export class BarterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  barter: string;

  @Column('text')
  teach: string;

  @Column('text')
  learn: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => UserEntity, author => author.barters)
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];

  @OneToMany(type => CommentEntity, comment => comment.barter, {
    cascade: true,
  })
  comments: CommentEntity[];
}
