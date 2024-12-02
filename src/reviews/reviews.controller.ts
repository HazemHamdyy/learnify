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
import { ReviewsService } from './reviews.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(user.id, createReviewDto);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the review',
    example: 1,
  })
  @Get('/:id')
  getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOneById(id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the review',
    example: 1,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.id, updateReviewDto);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the review',
    example: 1,
  })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.delete(id, user.id);
  }
}
