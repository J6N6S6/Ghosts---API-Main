import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { CreateCreditCardPaymentCase } from './useCases/create-credit-card-payment/create_credit_card_payment.case';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';

@Module({
  imports: [],
  providers: [
    CreatePixPaymentCase,
    CreateCreditCardPaymentCase,
    GetTransactionStatusCase,
    MercadoPagoService,
  ],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
