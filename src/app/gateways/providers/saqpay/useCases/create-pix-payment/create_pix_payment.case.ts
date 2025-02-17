import { TransactionsRepository } from '@/domain/repositories';
import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { TransactionsService } from '@/app/transactions/services/transactions.service';
import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';

interface PaymentOrderResponse {
  response: string;
  idTransaction: string;
  paymentCode: string; // Pix key
  message?: string;
}

@Injectable()
export class CreatePixPaymentCase {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async execute({
    payer,
    items,
    date_expiration,
    total_amount,
    transaction_id,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    const request_data = {
      valor: total_amount,
      nomeCliente: payer.first_name + ' ' + payer.last_name,
      partnerConciliationId: transaction_id,
    };

    try {
      const { data } = await this.httpService.axiosRef.post(
        '/venda',
        request_data,
      );
      const saqPayTransaction = data[0];

      if (!saqPayTransaction) {
        throw new ClientException('Não foi possivel inciar a transação.');
      }
      return {
        success: true,
        data: {
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
          total_transaction_value: total_amount,
          pix_key: saqPayTransaction.emv,
          payment_id: saqPayTransaction.id,
          expiration_date: date_expiration,
        },
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(error);
      throw new ClientException(msg);
    }
  }
}
