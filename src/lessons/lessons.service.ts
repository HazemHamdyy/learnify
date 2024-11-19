import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson | null> {
    const { sectionId, ...rest } = createLessonDto;
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });
    if (!section || section.course.teacherId !== userId) {
      throw new NotFoundException(
        `No section with this id: ${sectionId} this user own`,
      );
    }
    return await this.prisma.lesson.create({
      data: {
        ...rest,
        section: { connect: { id: sectionId } },
      },
    });
  }

  async findOneById(id: number, userId: number): Promise<Lesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        section: { include: { course: { include: { enrollments: true } } } },
      },
    });
    const enrollments = lesson.section.course.enrollments;
    const isEnrolled = enrollments.some(
      (el) => el.studentId === userId && el.status !== 'PENDING',
    );
    if (
      lesson.isFree ||
      isEnrolled ||
      lesson.section.course.teacherId === userId
    ) {
      return lesson;
    } else {
      lesson.contentFileLink = null;
      return lesson;
    }
  }

  async update(
    id: number,
    userId: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });
    if (!lesson || lesson.section.course.teacherId !== userId) {
      throw new NotFoundException(
        `No lesson with this id: ${id} this user own`,
      );
    }
    return await this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async delete(id: number, userId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });
    if (!lesson || lesson.section.course.teacherId !== userId) {
      throw new NotFoundException(
        `No lesson with this id: ${id} this user own`,
      );
    }

    return await this.prisma.lesson.delete({ where: { id } });
  }

  findComments(lessonId: number) {
    return this.prisma.comment.findMany({
      where: {
        lessonId,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
        _count: {
          select: {
            child_comments: true,
          },
        },
      },
    });
  }
}
