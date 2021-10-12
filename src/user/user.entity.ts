import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { BarterEntity } from '../barter/barter.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({ length: 255, unique: true })
  username: string;

  @Column('text')
  password: string;

  // @Column('text')
  // avatar: string;

  // @Column('text')
  // email: string;

  @OneToMany(type => BarterEntity, barter => barter.author)
  barters: BarterEntity[];

  @ManyToMany(type => BarterEntity, { cascade: true })
  @JoinTable()
  bookmarks: BarterEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, username, token } = this;
    const responseObject: any = { id, created, username };
    if (showToken) {
      responseObject.token = token;
    }
    if (this.barters) {
      responseObject.barters = this.barters;
    }
    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }
    return responseObject;
  }

  comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
