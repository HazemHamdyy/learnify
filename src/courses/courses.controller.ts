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
import { CreateCourseDto } from './dtos/create-course.dto';
import { CoursesService } from './courses.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Course, User } from '@prisma/client';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { FilterCoursesDto } from './dtos/filter-courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private coursesServices: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard)
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ): Promise<Course | null> {
    return this.coursesServices.create(createCourseDto, user.id);
  }

  @Get()
  getAllCourses(): Promise<Course[] | null> {
    return this.coursesServices.findAll();
  }

  @Get('/filtered')
  getFilteredCourses(
    @Body() filterCourseDto: FilterCoursesDto,
  ): Promise<Course[] | null> {
    return this.coursesServices.findFiltered(filterCourseDto);
  }

  @Get('/:id')
  getCourseById(@Param('id', ParseIntPipe) id: number): Promise<Course | null> {
    return this.coursesServices.findOneById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ): Promise<Course | null> {
    return this.coursesServices.update(user.id, id, updateCourseDto);
  }

  @Delete('/:id/admin')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteCourseByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.coursesServices.delete(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteCourseByOwner(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.coursesServices.deleteByOwner(id, user.id);
  }
}
