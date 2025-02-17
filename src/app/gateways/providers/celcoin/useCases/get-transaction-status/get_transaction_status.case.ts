import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';
import { PaymentStatus } from '@/app/ipn/types/payment_status.type';
import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GetTransactionStatusResponseDTO } from './get_transaction_status_response.dto';

@Injectable()
export class GetTransactionStatusCase {
  constructor(private readonly httpService: HttpService) {}

  async execute(transaction_id: string): Promise<GetStatusPayment> {
    try {
      const request = await this.httpService.axiosRef.get(
        `/1/sales/${transaction_id}`,
        {
          baseURL: 'https://apiquery.cieloecommerce.cielo.com.br/',
        },
      );

      const data: GetTransactionStatusResponseDTO = request.data;

      const transactionStatus = {
        0: PaymentStatus.PENDING,
        1: PaymentStatus.AUTHORIZED,
        2: PaymentStatus.AUTHORIZED,
        3: PaymentStatus.REJECTED,
        10: PaymentStatus.REFUNDED,
        11: PaymentStatus.REFUNDED,
        12: PaymentStatus.PENDING,
        13: PaymentStatus.REJECTED_BY_BANK,
      };

      return {
        payment_id: data.Payment.PaymentId,
        status: transactionStatus[data.Payment.Status] || PaymentStatus.ERROR,
        status_detail:
          transactionStatus[data.Payment.Status] || PaymentStatus.ERROR,
        external_reference: data.Payment.PaymentId,
        total_paid_amount: Number(
          (data.Payment.CapturedAmount / 100).toFixed(2),
        ),
        transaction_amount: Number((data.Payment.Amount / 100).toFixed(2)),
        date_approved: new Date(data.Payment.CapturedDate).toISOString(),
      };
    } catch (err) {
      const msg_error = err?.response?.data?.message || err.message;
      throw new ServerException(msg_error);
    }
  }
}
