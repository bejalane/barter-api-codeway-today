import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarterModule } from './barter/barter.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './shared/logger.interceptor';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { config } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    BarterModule,
    UserModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
