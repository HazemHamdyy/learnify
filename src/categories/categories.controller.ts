import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @ApiOperation({
    summary: 'Create category by admin',
  })
  @ApiBody({
    description: 'Category body contains name',
    schema: {
      example: {
        name: 'Web Development',
      },
    },
  })
  @Post()
  @UseGuards(AdminGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Find all categories names',
  })
  @Get()
  findAllCategories(): Promise<Category[] | null> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Find category data and its courses by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the category',
    example: 1,
  })
  @Get('/:id')
  findCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category | null> {
    return this.categoriesService.findOneById(id);
  }

  @ApiOperation({
    summary: 'update category data by admin',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the category',
    example: 1,
  })
  @ApiBody({
    description: 'Category body contains name',
    schema: {
      example: {
        name: 'Web Development',
      },
    },
  })
  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'update category data by admin',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the category',
    example: 1,
  })
  @Delete('/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
