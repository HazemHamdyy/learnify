import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { userId, ...createCommentDto },
    });
  }

  findOneById(id: number) {
    return this.prisma.comment.findUnique({
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

  update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.updateMany({
      where: { id, userId },
      data: updateCommentDto,
    });
  }

  delete(id: number, userId: number) {
    return this.prisma.comment.deleteMany({ where: { id, userId } });
  }
}
