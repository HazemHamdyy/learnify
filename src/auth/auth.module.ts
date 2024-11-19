import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  // providers: [UsersService],
  imports: [PrismaModule, UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
