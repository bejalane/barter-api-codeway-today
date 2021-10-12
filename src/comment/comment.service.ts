import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { BarterEntity } from '../barter/barter.entity';
import { UserEntity } from '../user/user.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(BarterEntity)
    private barterRepository: Repository<BarterEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    const responseObject: any = comment;
    if (comment.author) {
      responseObject.author = comment.author.toResponseObject(false);
    }
    return responseObject;
  }

  async showByBarter(id: string) {
    const barter = await this.barterRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.author', 'comments.barter'],
    });
    return barter.comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(id: string) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'barter'],
    });
    return this.toResponseObject(comment);
  }

  async create(barterId: string, userId: string, data: CommentDTO) {
    const barter = await this.barterRepository.findOne({
      where: { id: barterId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const comment = await this.commentRepository.create({
      ...data,
      barter,
      author: user,
    });

    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.commentRepository.delete({ id });
    return this.toResponseObject(comment);
  }
}
