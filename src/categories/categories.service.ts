import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category | null> {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll(): Promise<Category[] | null> {
    return this.prisma.category.findMany();
  }

  findOneById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { courses: true },
    });
  }

  update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  delete(id: number): Promise<Category | null> {
    return this.prisma.category.delete({ where: { id } });
  }
}
