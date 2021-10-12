import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BarterEntity } from './barter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BarterDTO, BarterRO, BarterPaginatedRO } from './barter.dto';
import { UserEntity } from '../user/user.entity';
import { Votes } from '../shared/votes.enum';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BarterService {
  constructor(
    @InjectRepository(BarterEntity)
    private barterRepository: Repository<BarterEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(barter: BarterEntity): BarterRO {
    return { ...barter, author: barter.author.toResponseObject(false) };
  }

  private toPaginatedResponseObject(
    result: Pagination<BarterEntity>,
  ): BarterPaginatedRO {
    return {
      ...result,
      items: result.items.map(barter => this.toResponseObject(barter)),
    };
  }

  private ensureOwnership(barter: BarterEntity, userId: string) {
    if (barter.author.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  private async vote(barter: BarterEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      barter[opposite].filter(voter => voter.id === user.id).length > 0 ||
      barter[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      //cancel vote (down or up)
      if (barter[opposite].filter(voter => voter.id === user.id).length > 0) {
        barter[opposite] = barter[opposite].filter(
          voter => voter.id !== user.id,
        );
        barter[vote].push(user);
      } else {
        barter[vote] = barter[vote].filter(voter => voter.id !== user.id);
      }
      await this.barterRepository.save(barter);
    } else if (barter[vote].filter(voter => voter.id === user.id).length < 1) {
      //add vote to barter
      barter[vote].push(user);
      await this.barterRepository.save(barter);
    } else {
      throw new HttpException('Unable to add vote', HttpStatus.BAD_REQUEST);
    }
    return barter;
  }

  // async showAll(page: number = 1): Promise<BartersRO>{
  //     const perPage = this.pagingSettings.perPage;
  //     const barters = await this.barterRepository.find({
  //         relations: ['author', 'upvotes', 'downvotes', 'comments'],
  //         take: perPage,
  //         skip: perPage * (page - 1),
  //         order: {created: 'DESC'}
  //     });
  //     const total = 1;

  //     return {
  //         barters: barters.map(barter => this.toResponseObject(barter)),
  //         count: total
  //     }
  // }

  async showAll(options: IPaginationOptions): Promise<BarterPaginatedRO> {
    const results = await paginate<BarterEntity>(
      this.barterRepository,
      options,
      {
        relations: ['author', 'upvotes', 'downvotes', 'comments', 'comments.author'],
        order: { created: 'DESC' },
      },
    );
    return this.toPaginatedResponseObject(results);
  }

  async create(userId: string, data: BarterDTO): Promise<BarterRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const barter = await this.barterRepository.create({
      ...data,
      author: user,
    });
    await this.barterRepository.save(barter);
    return this.toResponseObject(barter);
  }

  async read(id: string): Promise<BarterRO> {
    const barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!barter) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(barter);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<BarterDTO>,
  ): Promise<BarterRO> {
    let barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!barter) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(barter, userId);
    await this.barterRepository.update({ id }, data);
    barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return this.toResponseObject(barter);
  }

  async destroy(id: string, userId: string) {
    const barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!barter) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(barter, userId);
    await this.barterRepository.delete({ id });
    return this.toResponseObject(barter);
  }

  async upvoteBarter(id: string, userId: string) {
    let barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    barter = await this.vote(barter, user, Votes.UP);
    return this.toResponseObject(barter);
  }

  async downvoteBarter(id: string, userId: string) {
    let barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    barter = await this.vote(barter, user, Votes.DOWN);
    return this.toResponseObject(barter);
  }

  async bookmark(id: string, userId: string) {
    const barter = await this.barterRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (
      user.bookmarks.filter(bookmark => bookmark.id === barter.id).length < 1
    ) {
      user.bookmarks.push(barter);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Barter already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async unBookmark(id: string, userId: string) {
    const barter = await this.barterRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (
      user.bookmarks.filter(bookmark => bookmark.id === barter.id).length > 0
    ) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== barter.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'User have not bookmarked this barter',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }
}
