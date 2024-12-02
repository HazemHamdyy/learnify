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
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Create your comment on a lesson or on another comment',
    description: `You must add only one of commentId or lessonId`,
  })
  @Post()
  @UseGuards(AuthGuard)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(user.id, createCommentDto);
  }

  @ApiOperation({
    summary: 'Get Comment',
    description: `Fetch comment and its child comments`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the comment',
    example: 1,
  })
  @Get('/:id')
  findCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Update the content of the comment',
    description: `You can update only the content of the comment`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the comment',
    example: 1,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, user.id, updateCommentDto);
  }

  @ApiOperation({
    summary: 'Delete your own comment',
    description: `You can delete your own comment only`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the comment',
    example: 1,
  })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.delete(id, user.id);
  }
}
