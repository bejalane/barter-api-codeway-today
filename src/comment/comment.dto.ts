import { UserRO } from './../user/user.dto';
import { BarterRO } from './../barter/barter.dto';

import { IsString } from 'class-validator';

export class CommentDTO {
  @IsString()
  comment: string;
}

export class CommentRO {
  id: string;
  comment: string;
  created: string;
  author: UserRO;
  barter: BarterRO;
}
