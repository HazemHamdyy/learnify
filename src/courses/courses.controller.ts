import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('courses')
export class CoursesController {
  constructor(private coursesServices: CoursesService) {}

  @ApiOperation({
    summary: 'Create my own course',
    description: `You must be a teacher first to create your first course`,
  })
  @Post()
  @UseGuards(AuthGuard)
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: User,
  ): Promise<Course | null | HttpException> {
    return this.coursesServices.create(createCourseDto, user.id);
  }

  @ApiOperation({
    summary: 'Get all courses',
    description: `This request is public for unauthorized people also`,
  })
  @Get()
  getAllCourses(): Promise<Course[] | null> {
    return this.coursesServices.findAll();
  }

  @ApiOperation({
    summary: 'Get all courses by passing filter',
    description: `This request is public for unauthorized people also (you can include pagination also by passing skip and take fields)`,
  })
  @ApiQuery({
    type: FilterCoursesDto,
  })
  @Get('/filtered')
  getFilteredCourses(
    @Query() filterCourseDto: FilterCoursesDto,
  ): Promise<Course[] | null> {
    return this.coursesServices.findFiltered(filterCourseDto);
  }

  @ApiOperation({
    summary: 'Get course info by id',
    description: `Fetch course data including its sections`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the course',
    example: 1,
  })
  @Get('/:id')
  getCourseById(@Param('id', ParseIntPipe) id: number): Promise<Course | null> {
    return this.coursesServices.findOneById(id);
  }

  @ApiOperation({
    summary: 'Update course data',
    description: `Update course data by owner`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the course',
    example: 1,
  })
  @ApiBody({
    description: 'Update course by owner',
    type: UpdateCourseDto,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ): Promise<Course | null | HttpException> {
    return this.coursesServices.update(user.id, id, updateCourseDto);
  }

  @ApiOperation({
    summary: 'Delete course data',
    description: `Delete course data by Admin`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the course',
    example: 1,
  })
  @Delete('/:id/admin')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteCourseByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.coursesServices.delete(id);
  }

  @ApiOperation({
    summary: 'Update course data',
    description: `Update course data by owner`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the course',
    example: '1',
  })
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
