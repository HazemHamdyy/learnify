import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course, User } from '@prisma/client';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentStatusEnum } from 'src/enrollments/enums/enrollment-status.enum';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findUsers(): Promise<User[] | null> {
    return await this.prisma.user.findMany();
  }

  async findUserById(id: number): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        dateOfBirth: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
        imageUrl: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
    return;
  }

  async findTeacher(id: number) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          courses: true,
          bio: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`No teacher with this id: ${id}`);
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  findMyLearnings(userId: number): Promise<Course[] | null> {
    return this.prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            AND: [
              { studentId: userId },
              {
                status: {
                  not: EnrollmentStatusEnum.PENDING,
                },
              },
            ],
          },
        },
      },
      include: {
        enrollments: {
          where: {
            studentId: userId,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            expiryDate: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async updateUserToAdmin(id: number) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          userType: 'ADMIN',
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`No user with this id: ${id}`);
      }
      throw new BadRequestException('Something went wrong');
    }
  }
}
