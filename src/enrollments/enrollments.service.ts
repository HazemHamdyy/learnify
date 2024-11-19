import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import { Enrollment, User } from '@prisma/client';
import { StripeService } from 'src/stripe/stripe.service';
import { SessionDataDto } from 'src/stripe/dtos/session-data.dto';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';

type Transaction = {
  enrollment: Enrollment;
  seesionUrl: string;
};

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    user: User,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Transaction | null> {
    const course = await this.prisma.course.findUnique({
      where: { id: createEnrollmentDto.courseId },
    });
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: user.id,
          ...createEnrollmentDto,
        },
      });

      const sessionData: SessionDataDto = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        courseName: course.name,
        coursePrice: Math.round(course.price),
      };

      const session = await this.stripeService.createCheckoutSession(
        createEnrollmentDto.successUrl,
        createEnrollmentDto.cancelUrl,
        sessionData,
      );

      const payment = await prisma.payment.create({
        data: {
          enrollment: { connect: { id: enrollment.id } },
          amount: course.price,
          checkoutSessionId: session.id,
        },
      });

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paymentId: payment.id },
      });

      return { enrollment, seesionUrl: session.url };
    });
    return transaction;
  }

  findOneById(id: number) {
    return this.prisma.enrollment.findUnique({ where: { id } });
  }

  update(id: number, userId: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.prisma.enrollment.updateMany({
      where: {
        AND: [{ id }, { studentId: userId }, { status: { not: 'PENDING' } }],
      },
      data: updateEnrollmentDto,
    });
  }

  delete(id: number) {
    return this.prisma.enrollment.deleteMany({
      where: { AND: [{ id }, { status: 'PENDING' }] },
    });
  }
}
