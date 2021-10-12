import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';
import { PaginationClass } from '../shared/pagination.helper';

export class BarterDTO {
  @IsString()
  barter: string;

  @IsString()
  learn: string;

  @IsString()
  teach: string;
}

export class BarterRO {
  id?: string;
  updated: Date;
  created: Date;
  barter: string;
  teach: string;
  learn: string;
  author: UserRO;
  upvotes?: UserEntity[];
  downvotes?: UserEntity[];
}

export class BarterPaginatedRO extends PaginationClass {
  items: BarterRO[];
}
