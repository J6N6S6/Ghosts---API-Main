import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';
import { StartSessionCase } from './useCases/start-session/start_session.case';
import { PaggueioService } from './paggueio.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: 'https://ms.paggue.io/cashin/api',
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
    StartSessionCase,
    CreatePixPaymentCase,
    GetTransactionStatusCase,
    PaggueioService,
  ],
  exports: [PaggueioService],
})
export class PaggueioModule implements OnModuleInit {
  constructor(private readonly startSessionCase: StartSessionCase) {}

  async onModuleInit(): Promise<void> {
    await this.startSessionCase.execute();
  }
}
