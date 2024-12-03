import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: { userId, ...createCommentDto },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        childComments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            childComments: true,
          },
        },
      },
    });
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    return await this.prisma.comment.updateMany({
      where: { id, userId },
      data: updateCommentDto,
    });
  }

  async delete(id: number, userId: number) {
    return await this.prisma.comment.deleteMany({ where: { id, userId } });
  }
}
