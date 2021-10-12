import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BarterController } from './barter.controller';
import { BarterService } from './barter.service';
import { BarterEntity } from './barter.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarterEntity, UserEntity])],
  controllers: [BarterController],
  providers: [BarterService],
  exports: [BarterService],
})
export class BarterModule {}
