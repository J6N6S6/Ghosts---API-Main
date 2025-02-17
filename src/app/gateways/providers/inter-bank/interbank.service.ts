import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { BankSlipPaymentResponse } from '../../dtos/BankSlipPaymentResponse.dto';
import { CreateBankSlipPaymentDTO } from '../../dtos/CreateBankSlipPayment.dto';
import { CreateCreditCardPaymentDTO } from '../../dtos/CreateCreditCardPayment.dto';
import { CreatePixPaymentDTO } from '../../dtos/CreatePixPayment.dto';
import { CreditCardPaymentResponse } from '../../dtos/CreditCardPaymentResponse.dto';
import { PixPaymentResponse } from '../../dtos/PixPaymentResponse.dto';
import { BasePaymentService } from '../../types/base_payment_service';

@Injectable()
export class InterBankService implements BasePaymentService {
  createPixPayment(data: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    console.log('Method not implemented.', {
      data,
    });
    throw new ServerException('Method not implemented.');
  }

  createCreditCardPayment(
    data: CreateCreditCardPaymentDTO,
  ): Promise<CreditCardPaymentResponse> {
    console.log('Method not implemented.', {
      data,
    });
    throw new ServerException('Method not implemented.');
  }

  createBankSlipPayment(
    data: CreateBankSlipPaymentDTO,
  ): Promise<BankSlipPaymentResponse> {
    console.log('Method not implemented.', {
      data,
    });
    throw new ServerException('Method not implemented.');
  }

  getTransactionStatus(transaction_id: string): Promise<any> {
    console.log('Method not implemented.', {
      transaction_id,
    });
    throw new ServerException('Method not implemented.');
  }
}
