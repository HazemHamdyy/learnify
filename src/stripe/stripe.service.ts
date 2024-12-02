import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SessionDataDto } from './dtos/session-data.dto';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE') private readonly stripe: Stripe) {}

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ email, name });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
    });
  }

  async createCheckoutSession(
    sessionDataDto: SessionDataDto,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: sessionDataDto.successUrl,
      cancel_url: sessionDataDto.cancelUrl,
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: `${sessionDataDto.courseName} Course`,
            },
            unit_amount: sessionDataDto.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      currency: 'egp',
      customer_email: sessionDataDto.userEmail,
      metadata: {
        userId: sessionDataDto.userId,
        userName: sessionDataDto.userName,
      },
    });
  }

  async isCheckoutSessionPaid(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session.payment_status === 'paid';
    } catch (error) {
      throw new Error(`Failed to retrieve Checkout Session: ${error.message}`);
    }
  }
}
