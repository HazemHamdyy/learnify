import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { EnrollmentStatusEnum } from 'src/enrollments/enums/enrollment-status.enum';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createReviewDto.courseId },
      select: {
        teacherId: true,
        enrollments: {
          select: {
            status: true,
            studentId: true,
          },
          where: {
            studentId: userId,
          },
        },
      },
    });

    if (course.teacherId === userId) {
      throw new BadRequestException("You can't review your own course");
    }

    if (
      course.enrollments[0]?.studentId !== userId ||
      course.enrollments[0]?.status === EnrollmentStatusEnum.PENDING
    ) {
      throw new BadRequestException(
        'You can review your enrolled courses only',
      );
    }

    return await this.prisma.review.create({
      data: { ...createReviewDto, userId },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, imageUrl: true } },
        course: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
    return await this.prisma.review.updateMany({
      where: { id, userId },
      data: updateReviewDto,
    });
  }

  async delete(id: number, userId: number) {
    return await this.prisma.review.deleteMany({ where: { id, userId } });
  }
}
