import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Get,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { CommentService } from './comment.service';
import { User } from '../user/user.decorator';
import { CommentDTO } from './comment.dto';
import { UserEntity } from '../user/user.entity';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('barter/:id')
  showCommentsByBarter(@Param('id') barterId: string) {
    return this.commentService.showByBarter(barterId);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') userId: string) {
    return this.commentService.showByUser(userId);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Post('barter/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') barterId: string,
    @User() user: UserEntity,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(barterId, user.id, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  removeComment(@Param('id') id: string, @User() user: UserEntity) {
    return this.commentService.remove(id, user.id);
  }
}
