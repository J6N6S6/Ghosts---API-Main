import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { CelcoinService } from './celcoin.service';
import { CreateCreditCardPaymentCase } from './useCases/create-credit-card-payment/create_credit_card_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';
import { StartCelcoinSessionCase } from './useCases/start-celcoin-session/start_celcoin_session.case';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: 'https://api-celcash.celcoin.com.br/v2',
        };
      },
    }),
  ],
  providers: [
    CreateCreditCardPaymentCase,
    GetTransactionStatusCase,
    CelcoinService,
    StartCelcoinSessionCase,
  ],
  exports: [CelcoinService],
})
export class CelcoinModule implements OnModuleInit {
  constructor(
    private readonly startCelcoinSessionCase: StartCelcoinSessionCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.startCelcoinSessionCase.execute();
  }
}
