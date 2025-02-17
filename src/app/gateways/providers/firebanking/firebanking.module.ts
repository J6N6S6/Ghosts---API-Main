import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';
import { FirebankingService } from './firebanking.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: 'https://api.firebanking.io',
        };
      },
    }),
  ],
  providers: [
    CreatePixPaymentCase,
    GetTransactionStatusCase,
    FirebankingService,
  ],
  exports: [FirebankingService],
})
export class FirebankingModule {}
