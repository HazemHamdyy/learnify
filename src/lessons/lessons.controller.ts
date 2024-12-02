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
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}
  @ApiOperation({
    summary: `Create a lesson for your course`,
    description: `Create a lesson with the content file link`,
  })
  @Post()
  @UseGuards(AuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: User,
  ): Promise<Lesson | null> {
    return this.lessonService.create(user.id, createLessonDto);
  }

  @ApiOperation({
    summary: `Fetch lesson data`,
    description: `Data returning will be based on your enrollment, if you are not enrolled to the course the free content only you will get`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the lesson',
    example: 1,
  })
  @Get('/:id')
  @UseGuards(AuthGuard)
  findLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Lesson | null> {
    return this.lessonService.findOneById(id, user.id);
  }

  @ApiOperation({
    summary: `Update the lesson data of your course`,
    description: `You can't update secionId`,
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Introduuction',
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the lesson',
    example: 1,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() updateLessonnDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    return this.lessonService.update(id, user.id, updateLessonnDto);
  }

  @ApiOperation({
    summary: `Delete lesson from your course`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the lesson',
    example: 1,
  })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteLesson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.delete(id, user.id);
  }

  @ApiOperation({
    summary: `Fetch comments of the lesson`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the lesson',
    example: 1,
  })
  @Get('/:id/comments')
  getCommentsOfLessons(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findComments(id);
  }
}
