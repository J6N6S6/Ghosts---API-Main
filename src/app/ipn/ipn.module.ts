import { InfraModule } from '@/infra/infra.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { StarpayIpnCase } from './useCases/starpay-ipn/starpay.ipn.case';
import { IpnController } from './controllers/ipn.controller';
import { IpnService } from './services/ipn.service';
import { CreateTransactionIpnCase } from './useCases/create-transaction-ipn/create_transaction_ipn.case';
import { AuthorizedPaymentCase } from './useCases/create-transaction-ipn/useCases/authorized_payment.case';
import { DisputeAcceptedPaymentCase } from './useCases/create-transaction-ipn/useCases/dispute_accepted_payment.case';
import { DisputeRejectedPaymentCase } from './useCases/create-transaction-ipn/useCases/dispute_rejected_payment.case';
import { InDisputePaymentCase } from './useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { DeliveryProductsCase } from './useCases/delivery-products/delivery_products.case';
import { InterpjIpnCase } from './useCases/interpj-ipn/interpj.ipn.case';
import { MercadoPagoIpnCase } from './useCases/mercadopago-ipn/mercadopago.ipn.case';
import { OpenPixIpnCase } from './useCases/openpix-ipn/openpix.ipn.case';
import { PaggueioIpnCase } from './useCases/paggueio-ipn/paggueio.ipn.case';
import { PagstarIpnCase } from './useCases/pagstar-ipn/pagstar.ipn.case';
import { RemoveProductsCase } from './useCases/remove-products/remove_products.case';
import { Safe2PayIpnCase } from './useCases/safe2pay-ipn/safe2pay.ipn.case';
import { SaqPayIpnCase } from './useCases/saqpay-ipn/saqpay.ipn.case';
import { SuitpayIpnCase } from './useCases/suitpay-ipn/suitpay.ipn.case';
import { CieloIpnCase } from './useCases/cielo-ipn/cielo.ipn.case';
import { FirebankingIpnCase } from './useCases/firebanking-ipn/firebanking.ipn.case';
import { RefundedPaymentCase } from './useCases/create-transaction-ipn/useCases/refunded_payment.case copy';

@Module({
  imports: [
    HttpModule,
    InfraModule,
    AuthModule,
    ConfigModule,
    CacheModule.register(),
    GatewaysModule,
  ],
  controllers: [IpnController],
  providers: [
    IpnService,
    CreateTransactionIpnCase,
    AuthorizedPaymentCase,
    InDisputePaymentCase,
    RefundedPaymentCase,

    RemoveProductsCase,
    DisputeRejectedPaymentCase,
    DisputeAcceptedPaymentCase,
    DeliveryProductsCase,
    InterpjIpnCase,
    PagstarIpnCase,
    Safe2PayIpnCase,
    MercadoPagoIpnCase,
    OpenPixIpnCase,
    SuitpayIpnCase,
    SaqPayIpnCase,
    PaggueioIpnCase,
    StarpayIpnCase,
    CieloIpnCase,
    FirebankingIpnCase,
  ],
  exports: [
    CreateTransactionIpnCase,
    IpnService,
    DisputeAcceptedPaymentCase,
    InDisputePaymentCase,
    AuthorizedPaymentCase,
    RemoveProductsCase,
    DeliveryProductsCase,
    DisputeRejectedPaymentCase,
  ],
})
export class IpnModule {}
