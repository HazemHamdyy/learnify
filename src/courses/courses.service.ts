import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Course } from '@prisma/client';
import { FilterCoursesDto } from './dtos/filter-courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createCourseDto: CreateCourseDto,
    userId: number,
  ): Promise<Course | null> {
    const { categoryId, ...rest } = createCourseDto;
    return this.prisma.course.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        teacher: { connect: { id: userId } },
      },
    });
  }

  findAll(): Promise<Course[] | null> {
    return this.prisma.course.findMany();
  }

  findFiltered(filterCoursesDto: FilterCoursesDto): Promise<Course[] | null> {
    return this.prisma.course.findMany({
      where: {
        ...(filterCoursesDto.name && {
          name: { contains: filterCoursesDto.name, mode: 'insensitive' },
        }),
        ...(filterCoursesDto.minPrice !== undefined && {
          price: { gte: filterCoursesDto.minPrice },
        }),
        ...(filterCoursesDto.maxPrice !== undefined && {
          price: { lte: filterCoursesDto.maxPrice },
        }),
        ...(filterCoursesDto.teacherId && {
          teacherId: filterCoursesDto.teacherId,
        }),
        ...(filterCoursesDto.categoryId && {
          categoryId: filterCoursesDto.categoryId,
        }),
      },
    });
  }

  async findOneById(id: number): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: true,
        teacher: { select: { id: true, name: true, imageUrl: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with id: ${id} not found`);
    }
    return course;
  }

  async update(
    userId: number,
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course | null> {
    try {
      const course = await this.prisma.course.updateMany({
        where: { id, teacherId: userId },
        data: updateCourseDto,
      });
      return course[0];
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found.`);
      } else {
        throw new BadRequestException(`Something went wrong`);
      }
    }
  }

  async delete(id: number) {
    await this.prisma.course.delete({ where: { id } });
    return;
  }

  async deleteByOwner(id: number, teacherId: number) {
    await this.prisma.course.deleteMany({ where: { id, teacherId } });
    return;
  }

  async getBestSelling(): Promise<Course[] | null> {
    const bestSellingCourses = await this.prisma.enrollment.groupBy({
      by: ['courseId'],
      _count: {
        courseId: true,
      },
      orderBy: {
        _count: {
          courseId: 'desc',
        },
      },
      take: 10, // Limit to top 10 best-sellers
    });

    const courses = await Promise.all(
      bestSellingCourses.map(async (enrollment) => {
        const course = await this.prisma.course.findUnique({
          where: { id: enrollment.courseId },
        });
        return {
          ...course,
          enrollmentCount: enrollment._count.courseId,
        };
      }),
    );
    return courses;
  }
}
