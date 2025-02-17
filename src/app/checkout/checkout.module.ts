import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler'; // Importar ThrottlerModule
import { APP_GUARD } from '@nestjs/core'; // Importar APP_GUARD para o guard customizado

import { InfraModule } from '@/infra/infra.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { IpnModule } from '../ipn/ipn.module';
import { ProductsModule } from '../products/products.module';
import { ProductsLinkModule } from '../products_link/products_link.module';

import { CheckoutController } from './controllers/checkout.controller';
import { CheckoutService } from './services/checkout.service';
import { ExecuteBankSlipPaymentCase } from './useCases/create-payment/cases/execute_bank_slip_payment.case';
import { ExecuteCreditCardPaymentCase } from './useCases/create-payment/cases/execute_credit_card_payment.case';
import { ExecutePixPaymentCase } from './useCases/create-payment/cases/execute_pix_payment.case';
import { CreatePaymentCase } from './useCases/create-payment/create_payment.case';
import { ExecutePaymentCase } from './useCases/create-payment/execute_payment.case';
import { GetPaymentStatusCase } from './useCases/get-payment-status/get_payment_status.case';
import { GetProductCheckoutCase } from './useCases/get-product-checkout/get_product_checkout.case';
import { SendMetaMetricsCase } from './useCases/send-meta-metrics/send_meta_metrics.case';
import { CustomThrottlerGuard } from './guards/CustomThrottleGuard';

@Module({
  imports: [
    InfraModule,
    IpnModule,
    ProductsModule,
    ProductsLinkModule,
    ConfigModule,
    JwtModule,
    GatewaysModule,
    // ThrottlerModule.forRoot({
    //   ttl: 60, // Limite de tempo (60 segundos)
    //   limit: 3, // Limite de 3 requisições por IP
    // }),
  ],
  controllers: [CheckoutController],
  providers: [
    CreatePaymentCase,
    GetPaymentStatusCase,
    GetProductCheckoutCase,
    CheckoutService,
    ExecuteBankSlipPaymentCase,
    ExecuteCreditCardPaymentCase,
    ExecutePixPaymentCase,
    SendMetaMetricsCase,
    ExecutePaymentCase,
  ],
  exports: [CreatePaymentCase, GetPaymentStatusCase, CheckoutService],
})
export class CheckoutModule {}
