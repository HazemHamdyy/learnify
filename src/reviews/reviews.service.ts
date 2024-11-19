import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createReviewDto.courseId },
    });

    if (course.teacherId === userId) {
      throw new BadRequestException("You can't review your own course");
    }

    return await this.prisma.review.create({
      data: { ...createReviewDto, userId },
    });
  }

  findOneById(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, imageUrl: true } },
        course: { select: { id: true, name: true } },
      },
    });
  }

  update(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.updateMany({
      where: { id, userId },
      data: updateReviewDto,
    });
  }

  delete(id: number, userId: number) {
    return this.prisma.review.deleteMany({ where: { id, userId } });
  }
}
