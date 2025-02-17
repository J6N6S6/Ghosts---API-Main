import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SaqPayService } from './saqpay.service';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isSandbox = false;

        return {
          baseURL: isSandbox
            ? 'https://pix-service.saqja.com/api'
            : 'https://pix-service.saqja.com/api',
          headers: {
            'content-type': 'application/json',
            Authorization: configService.get<string>('saqpay.authorization'),
          },
        };
      },
    }),
    ConfigModule,
  ],
  providers: [CreatePixPaymentCase, SaqPayService],
  exports: [SaqPayService],
})
export class SaqPayModule {}
