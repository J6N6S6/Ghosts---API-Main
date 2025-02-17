import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PagstarService } from './pagstar.service';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';
import { StartPagstarSessionCase } from './useCases/start-pagstar-session/start_pagstar_session.case';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isSandbox = configService.get<boolean>('pagstar.is_sandbox');

        return {
          baseURL: isSandbox
            ? 'https://dev-api.pagstar.com/api'
            : 'https://api.pagstar.com/api',
          headers: {
            'User-Agent': `Sunize Digital (${configService.get<string>(
              'pagstar.client_email',
            )})`,
          },
        };
      },
    }),
  ],
  providers: [
    StartPagstarSessionCase,
    CreatePixPaymentCase,
    GetTransactionStatusCase,
    PagstarService,
  ],
  exports: [PagstarService],
})
export class PagstarModule implements OnModuleInit {
  constructor(
    private readonly startPagstarSessionCase: StartPagstarSessionCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.startPagstarSessionCase.execute();
  }
}
