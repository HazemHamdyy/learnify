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
      amount,
      currency,
    });
  }

  async createCheckoutSession(
    successUrl: string,
    cancelUrl: string,
    sessionDataDto: SessionDataDto,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: `${sessionDataDto.courseName} Course`,
            },
            unit_amount: sessionDataDto.coursePrice,
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
}