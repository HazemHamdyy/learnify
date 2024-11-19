import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_TEST_SK'), {
          apiVersion: '2024-10-28.acacia',
        });
      },
    },
    StripeService,
  ],
  exports: ['STRIPE', StripeService],
})
export class StripeModule {}
