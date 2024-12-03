import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category | null> {
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll(): Promise<Category[] | null> {
    return await this.prisma.category.findMany();
  }

  async findOneById(id: number): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id },
      include: { courses: true },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: number): Promise<Category | null> {
    return await this.prisma.category.delete({ where: { id } });
  }
}
