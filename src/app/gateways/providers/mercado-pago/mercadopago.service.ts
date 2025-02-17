import { Injectable } from '@nestjs/common';
import { BankSlipPaymentResponse } from '../../dtos/BankSlipPaymentResponse.dto';
import { CreateBankSlipPaymentDTO } from '../../dtos/CreateBankSlipPayment.dto';
import { CreateCreditCardPaymentDTO } from '../../dtos/CreateCreditCardPayment.dto';
import { CreatePixPaymentDTO } from '../../dtos/CreatePixPayment.dto';
import { CreditCardPaymentResponse } from '../../dtos/CreditCardPaymentResponse.dto';
import { GetStatusPayment } from '../../dtos/GetStatusPayment.dto';
import { PixPaymentResponse } from '../../dtos/PixPaymentResponse.dto';
import { BasePaymentService } from '../../types/base_payment_service';
import { CreateCreditCardPaymentCase } from './useCases/create-credit-card-payment/create_credit_card_payment.case';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';
import { GetTransactionStatusCase } from './useCases/get-transaction-status/get_transaction_status.case';
import { ServerException } from '@/infra/exception/server.exception';

@Injectable()
export class MercadoPagoService implements BasePaymentService {
  constructor(
    private readonly createPixPaymentCase: CreatePixPaymentCase,
    private readonly createCreditCardPaymentCase: CreateCreditCardPaymentCase,
    private readonly getTransactionStatusCase: GetTransactionStatusCase,
  ) {}

  createPixPayment(data: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    return this.createPixPaymentCase.execute(data);
  }

  createCreditCardPayment(
    data: CreateCreditCardPaymentDTO,
  ): Promise<CreditCardPaymentResponse> {
    return this.createCreditCardPaymentCase.execute(data);
  }

  createBankSlipPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: CreateBankSlipPaymentDTO,
  ): Promise<BankSlipPaymentResponse> {
    throw new ServerException('Method not implemented.');
  }

  getTransactionStatus(transaction_id: string): Promise<GetStatusPayment> {
    return this.getTransactionStatusCase.execute(transaction_id);
  }
}
