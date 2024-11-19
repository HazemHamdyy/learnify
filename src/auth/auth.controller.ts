import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpadatePasswordDto } from './dtos/update-password.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async signin(
    @Body() authPayloadDto: AuthPayloadDto,
    @Session() session: any,
  ) {
    const user = await this.authService.validateUser(authPayloadDto);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  @HttpCode(204)
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Patch('/update-password')
  @UseGuards(AuthGuard)
  updatePassword(
    @Body() updatePasswordDto: UpadatePasswordDto,
    @CurrentUser() user: User,
  ) {
    return this.authService.updatePassword(
      user.id,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    );
  }
}
