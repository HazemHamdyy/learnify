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
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Lesson, User } from '@prisma/client';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}
  @Post()
  @UseGuards(AuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: User,
  ): Promise<Lesson | null> {
    return this.lessonService.create(user.id, createLessonDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Lesson | null> {
    return this.lessonService.findOneById(id, user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<Lesson | null> {
    return this.lessonService.update(id, user.id, createLessonDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.delete(id, user.id);
  }

  @Get('/:id/comments')
  getCommentsOfLessons(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findComments(id);
  }
}
