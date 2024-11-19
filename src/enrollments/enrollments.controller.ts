import {
  Controller,
  Post,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createEnrollment(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @CurrentUser() user: User,
  ) {
    return this.enrollmentsService.create(user, createEnrollmentDto);
  }

  @Get('/:id')
  @UseGuards(AdminGuard)
  findEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOneById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @CurrentUser() user: User,
  ) {
    return this.enrollmentsService.update(id, user.id, updateEnrollmentDto);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.delete(id);
  }
}
