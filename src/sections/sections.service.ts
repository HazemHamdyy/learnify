import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dtos/create-section.dto';
import { UpdateSectionDto } from './dtos/update-section.dto';
import { EnrollmentStatusEnum } from 'src/enrollments/enums/enrollment-status.enum';
import { Section } from '@prisma/client';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createSectionDto: CreateSectionDto,
  ): Promise<Section | null> {
    const { courseId, ...rest } = createSectionDto;
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.teacherId !== userId) {
      throw new NotFoundException(
        `No course with this id: ${courseId} this user own`,
      );
    }

    return await this.prisma.section.create({
      data: {
        ...rest,
        course: { connect: { id: courseId } },
      },
    });
  }

  async findOneById(id: number, userId: number): Promise<Section | null> {
    try {
      const section = await this.prisma.section.findUniqueOrThrow({
        where: { id },
        include: {
          lessons: true,
          course: {
            select: {
              id: true,
              name: true,
              teacherId: true,
              enrollments: {
                where: {
                  AND: [
                    { studentId: userId },
                    {
                      status: {
                        not: EnrollmentStatusEnum.PENDING,
                      },
                    },
                  ],
                },
                select: {
                  studentId: true,
                },
              },
            },
          },
        },
      });
      if (
        section.course.enrollments[0]?.studentId !== userId &&
        section.course.teacherId !== userId
      ) {
        const lessons = section.lessons.map((lesson) => {
          if (!lesson.isFree) lesson.contentFileLink = undefined;
          return lesson;
        });
        section.lessons = lessons;
      }
      return section;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`No section with this id: ${id}`);
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(
    id: number,
    userId: number,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section | null> {
    const section = await this.prisma.section.findUnique({
      where: {
        id,
      },
      include: { course: true },
    });

    if (!section || section.course.teacherId !== userId) {
      throw new NotFoundException(
        `No section with this id: ${id} this user own`,
      );
    }

    return await this.prisma.section.update({
      where: {
        id,
      },
      data: updateSectionDto,
    });
  }

  async delete(id: number, userId: number) {
    const section = await this.prisma.section.findUnique({
      where: {
        id,
      },
      include: { course: true },
    });

    if (!section || section.course.teacherId !== userId) {
      throw new NotFoundException(
        `No section with this id: ${id} this user own`,
      );
    }
    return await this.prisma.section.delete({
      where: { id },
    });
  }
}
