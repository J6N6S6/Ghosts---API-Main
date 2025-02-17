import { BankSlipPaymentResponse } from '../dtos/BankSlipPaymentResponse.dto';
import { CreateBankSlipPaymentDTO } from '../dtos/CreateBankSlipPayment.dto';
import { CreateCreditCardPaymentDTO } from '../dtos/CreateCreditCardPayment.dto';
import { CreatePixPaymentDTO } from '../dtos/CreatePixPayment.dto';
import { CreditCardPaymentResponse } from '../dtos/CreditCardPaymentResponse.dto';
import { PixPaymentResponse } from '../dtos/PixPaymentResponse.dto';

export abstract class BasePaymentService {
  abstract createPixPayment(
    data: CreatePixPaymentDTO,
  ): Promise<PixPaymentResponse>;
  abstract createCreditCardPayment(
    data: CreateCreditCardPaymentDTO,
  ): Promise<CreditCardPaymentResponse>;
  abstract createBankSlipPayment(
    data: CreateBankSlipPaymentDTO,
  ): Promise<BankSlipPaymentResponse>;

  abstract getTransactionStatus(transaction_id: string): Promise<any>;
}
