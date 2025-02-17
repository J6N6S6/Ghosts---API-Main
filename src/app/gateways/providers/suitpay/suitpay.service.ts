import { Injectable } from '@nestjs/common';
import { BasePaymentService } from '../../types/base_payment_service';
import { BankSlipPaymentResponse } from '../../dtos/BankSlipPaymentResponse.dto';
import { CreateBankSlipPaymentDTO } from '../../dtos/CreateBankSlipPayment.dto';
import { CreateCreditCardPaymentDTO } from '../../dtos/CreateCreditCardPayment.dto';
import { CreatePixPaymentDTO } from '../../dtos/CreatePixPayment.dto';
import { CreditCardPaymentResponse } from '../../dtos/CreditCardPaymentResponse.dto';
import { PixPaymentResponse } from '../../dtos/PixPaymentResponse.dto';
import { CreatePixPaymentCase } from './useCases/create-pix-payment/create_pix_payment.case';

@Injectable()
export class SuitpayService implements BasePaymentService {
  constructor(private readonly createPixPaymentCase: CreatePixPaymentCase) {}

  createPixPayment(data: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    return this.createPixPaymentCase.execute(data);
  }

  createCreditCardPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: CreateCreditCardPaymentDTO,
  ): Promise<CreditCardPaymentResponse> {
    throw new Error('Method not implemented.');
  }

  createBankSlipPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: CreateBankSlipPaymentDTO,
  ): Promise<BankSlipPaymentResponse> {
    throw new Error('Method not implemented.');
  }

  getTransactionStatus(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transaction_id: string,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
