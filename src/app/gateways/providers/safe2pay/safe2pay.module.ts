import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Safe2PayService } from './safe2pay.service';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { CreateCreditCardPaymentCase } from './useCases/create-credit-card-payment/create_credit_card_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    CreatePixPaymentCase,
    CreateCreditCardPaymentCase,
    GetTransactionStatusCase,
    Safe2PayService,
  ],
  exports: [Safe2PayService],
})
export class Safe2PayModule {}
