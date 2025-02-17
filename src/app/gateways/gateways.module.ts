import { Module } from '@nestjs/common';
import { InterBankModule } from './providers/inter-bank/interbank.module';
import { MercadoPagoModule } from './providers/mercado-pago/mercadopago.module';
import { OpenPixModule } from './providers/openpix/openpix.module';
import { PagstarModule } from './providers/pagstar/pagstar.module';
import { Safe2PayModule } from './providers/safe2pay/safe2pay.module';
import { SuitpayModule } from './providers/suitpay/suitpay.module';
import { PaymentService } from './services/payment.service';
import { SaqPayModule } from './providers/saqpay/saqpay.module';
import { PaggueioModule } from './providers/paggueio/paggueio.module';
import { StarpayModule } from './providers/starpay/starpay.module';
import { CieloModule } from './providers/cielo/cielo.module';
import { FirebankingModule } from './providers/firebanking/firebanking.module';
import { CelcoinModule } from './providers/celcoin/celcoin.module';

@Module({
  imports: [
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
