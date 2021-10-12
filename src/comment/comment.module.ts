import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarterEntity } from '../barter/barter.entity';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BarterEntity, UserEntity, CommentEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
