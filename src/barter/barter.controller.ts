import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { BarterService } from './barter.service';
import { BarterDTO } from './barter.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { getRoute } from '../shared/request.helper';
import { paginationSettings } from '../shared/pagination.helper';

@Controller('api/barter')
export class BarterController {
  constructor(private barterService: BarterService) {}

  @Get()
  showAllBarters(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = paginationSettings.limit,
    @Request() req,
  ) {
    return this.barterService.showAll({ page, limit, route: getRoute(req) });
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createBarter(@User() user, @Body() data: BarterDTO) {
    return this.barterService.create(user.id, data);
  }

  @Get(':id')
  readBarter(@Param('id') id: string) {
    return this.barterService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @User() user,
    @Body() data: Partial<BarterDTO>,
  ) {
    return this.barterService.update(id, user.id, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  removeBarter(@Param('id') id: string, @User() user) {
    return this.barterService.destroy(id, user.id);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  upvoteBarter(@Param('id') id: string, @User() user) {
    return this.barterService.upvoteBarter(id, user.id);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  downvoteBarter(@Param('id') id: string, @User() user) {
    return this.barterService.downvoteBarter(id, user.id);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  unbookmarkBarter(@Param('id') id: string, @User() user) {
    return this.barterService.unBookmark(id, user.id);
  }
}
