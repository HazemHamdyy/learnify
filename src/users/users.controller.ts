import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Course, User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/:id/teacher')
  getTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findTeacher(id);
  }

  @Patch('/me')
  @UseGuards(AuthGuard)
  updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get('/me/my-learning')
  @UseGuards(AuthGuard)
  getMyLearning(@CurrentUser() user: User): Promise<Course[] | null> {
    return this.usersService.findMyLearnings(user.id);
  }
}
