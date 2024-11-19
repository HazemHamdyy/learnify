import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid Credintial');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException('Invalid Credintial');
    }
    return user;
  }

  async signup({
    email,
    password,
    ...rest
  }: CreateUserDto): Promise<User | null> {
    // check if the email is already used
    const oldUser = await this.prisma.user.findUnique({ where: { email } });
    if (oldUser) {
      throw new BadRequestException('this email is already in use');
    }

    // Generate random salt and hash password with the salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    // create user

    const user = await this.prisma.user.create({
      data: { email, password: result, ...rest },
    });

    return user;
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(oldPassword, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException('Invalid Credintial');
    }
    const salt2 = randomBytes(8).toString('hex');
    const hash2 = (await scrypt(newPassword, salt2, 32)) as Buffer;

    const result = salt2 + '.' + hash2.toString('hex');
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: result },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUser;

    return rest;
  }
}
