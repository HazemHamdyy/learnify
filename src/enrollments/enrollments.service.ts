import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import { Enrollment, User } from '@prisma/client';
import { StripeService } from 'src/stripe/stripe.service';
import { SessionDataDto } from 'src/stripe/dtos/session-data.dto';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';
import { EnrollmentStatusEnum } from './enums/enrollment-status.enum';
import { Request } from 'express';

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
    req: Request,
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
      const protocol = req.protocol;
      const host = req.get('host');
      const successPath = `/enrollments/success/${enrollment.id}`;
      const cancelPath = `/enrollments/cancel`;
      const successUrl = `${protocol}://${host}${successPath}`;
      const cancelUrl = `${protocol}://${host}${cancelPath}`;

      const sessionData: SessionDataDto = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        courseName: course.name,
        coursePrice: Math.round(course.price),
        successUrl,
        cancelUrl,
      };

      const session =
        await this.stripeService.createCheckoutSession(sessionData);

      await prisma.payment.create({
        data: {
          enrollment: { connect: { id: enrollment.id } },
          amount: course.price * 100,
          checkoutSessionId: session.id,
        },
      });

      return { enrollment, seesionUrl: session.url };
    });
    return transaction;
  }

  async findOneById(id: number) {
    return await this.prisma.enrollment.findUnique({ where: { id } });
  }

  async update(
    id: number,
    userId: number,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return await this.prisma.enrollment.updateMany({
      where: {
        AND: [{ id }, { studentId: userId }, { status: { not: 'PENDING' } }],
      },
      data: updateEnrollmentDto,
    });
  }

  async delete(id: number) {
    return await this.prisma.enrollment.deleteMany({
      where: { AND: [{ id }, { status: 'PENDING' }] },
    });
  }

  async checkPayment(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { enrollmentId: id },
    });
    const isPaid = await this.stripeService.isCheckoutSessionPaid(
      payment.checkoutSessionId,
    );
    if (!isPaid) return false;
    await this.prisma.enrollment.update({
      where: { id },
      data: { status: EnrollmentStatusEnum.ACTIVE },
    });
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS' },
    });
    return true;
  }
}
