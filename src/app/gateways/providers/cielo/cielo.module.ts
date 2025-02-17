import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CieloService } from './cielo.service';
import { CreateCreditCardPaymentCase } from './useCases/create-credit-card-payment/create_credit_card_payment.case';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: 'https://api.cieloecommerce.cielo.com.br/',
          headers: {
            MerchantId: configService.get<string>('cielo.merchant_id'),
            MerchantKey: configService.get<string>('cielo.merchant_key'),
          },
        };
      },
    }),
  ],
  providers: [
    CreatePixPaymentCase,
    CreateCreditCardPaymentCase,
    GetTransactionStatusCase,
    CieloService,
  ],
  exports: [CieloService],
})
export class CieloModule {}
