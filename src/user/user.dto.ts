import { IsString, IsNotEmpty } from 'class-validator';
import { BarterEntity } from 'src/barter/barter.entity';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created: string;
  avatar?: string;
  token?: string;
  bookmarks?: BarterEntity[];
}
