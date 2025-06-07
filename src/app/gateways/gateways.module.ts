import { Module } from '@nestjs/common';
// import { Module, Logger } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

import { PagstarModule } from './providers/pagstar/pagstar.module';
import { InterBankModule } from './providers/inter-bank/interbank.module';
import { MercadoPagoModule } from './providers/mercado-pago/mercadopago.module';
import { OpenPixModule } from './providers/openpix/openpix.module';
import { Safe2PayModule } from './providers/safe2pay/safe2pay.module';
import { SuitpayModule } from './providers/suitpay/suitpay.module';
import { SaqPayModule } from './providers/saqpay/saqpay.module';
import { PaggueioModule } from './providers/paggueio/paggueio.module';
import { StarpayModule } from './providers/starpay/starpay.module';
import { CieloModule } from './providers/cielo/cielo.module';
import { FirebankingModule } from './providers/firebanking/firebanking.module';
import { CelcoinModule } from './providers/celcoin/celcoin.module';

import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    ConfigModule,

    // Agora o CacheModule e o HttpModule existem:
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

    Safe2PayModule,
    InterBankModule,
    MercadoPagoModule,
    PagstarModule,
    OpenPixModule,
    SuitpayModule,
    SaqPayModule,
    PaggueioModule,
    StarpayModule,
    CieloModule,
    FirebankingModule,
    CelcoinModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class GatewaysModule {}
