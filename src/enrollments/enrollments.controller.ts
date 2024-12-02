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
  Req,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';
import { ApiExcludeEndpoint, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Enroll to a new course',
  })
  createEnrollment(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @CurrentUser() user: User,
    @Req() req: Request,
  ) {
    return this.enrollmentsService.create(user, createEnrollmentDto, req);
  }

  @ApiOperation({
    summary: 'Get Enrollment information',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the enrollment',
    example: 1,
  })
  @Get('/:id')
  @UseGuards(AdminGuard)
  findEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOneById(id);
  }

  @ApiOperation({
    summary: `Update Enrollment status (if it isn't PENDING)`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the enrollment',
    example: 1,
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @CurrentUser() user: User,
  ) {
    return this.enrollmentsService.update(id, user.id, updateEnrollmentDto);
  }

  @ApiOperation({
    summary: `Delete enrollment by admin`,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the enrollment',
    example: 1,
  })
  @Delete('/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.delete(id);
  }

  @ApiExcludeEndpoint()
  @Get('/success/:id')
  async successPayment(@Param('id', ParseIntPipe) id: number) {
    const success = await this.enrollmentsService.checkPayment(id);
    return { success };
  }

  @ApiExcludeEndpoint()
  @Get('/cancel')
  async cancelPayment() {
    return { message: 'You have canceled the session' };
  }
}
