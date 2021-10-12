import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BarterEntity } from '../barter/barter.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  comment: Date;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(type => BarterEntity, barter => barter.comments)
  barter: BarterEntity;
}
