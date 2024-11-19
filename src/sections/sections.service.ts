import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dtos/create-section.dto';
import { Section } from '@prisma/client';
import { UpdateSectionDto } from './dtos/update-section.dto';

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

  findOneById(id: number): Promise<Section | null> {
    return this.prisma.section.findUnique({
      where: { id },
      include: {
        lessons: {
          select: {
            id: true,
            name: true,
            contentType: true,
            durationInMinutes: true,
            isFree: true,
          },
        },
      },
    });
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
