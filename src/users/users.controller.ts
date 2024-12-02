import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Course, User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { BeAdminDto } from './dtos/be-admin.dto';

@Controller('users')
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({
    summary: `Get teacher portfolio`,
    description: 'Fetch teacher public info including his own courses',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique ID of the teacher',
    example: '3',
  })
  @Get('/:id/teacher')
  getTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findTeacher(id);
  }

  @ApiOperation({
    summary: 'Update my information',
    description: 'Update your data (except email and password)',
  })
  @ApiBody({
    description: 'Update your data (except email and password)',
    schema: {
      example: {
        dateOfBirth: '2024-12-01T14:44:30.618Z',
        bio: "I'm a good teacher",
      },
    },
  })
  @Patch('/me')
  @UseGuards(AuthGuard)
  updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Get my information',
    description: 'Get all my information except password',
  })
  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Get my learning',
    description: 'Fetch all courses you enrolled in',
  })
  @Get('/me/my-learning')
  @UseGuards(AuthGuard)
  getMyLearning(@CurrentUser() user: User): Promise<Course[] | null> {
    return this.usersService.findMyLearnings(user.id);
  }

  @ApiOperation({
    summary: 'Update user to admin',
    description: 'Make someone admin (this route is valid for admin only)',
  })
  @Post('/be-admin')
  @UseGuards(AdminGuard)
  updateUserToAdmin(@Body() beAdminDto: BeAdminDto) {
    return this.usersService.updateUserToAdmin(beAdminDto.userId);
  }
}
