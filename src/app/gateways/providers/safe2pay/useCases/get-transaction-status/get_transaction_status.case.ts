import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';
import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetTransactionStatusCase {
  private readonly headers: Record<string, string>;

  constructor(private readonly httpService: HttpService) {
    this.headers = {
      'x-api-key': String(
        process.env.SAFE2PAY_MODE === 'production'
          ? String(process.env.SAFE2PAY_PRODUCTION_KEY)
          : String(process.env.SAFE2PAY_SANDBOX_KEY),
      ),
    };
  }

  async execute(transaction_id: string): Promise<GetStatusPayment> {
    try {
      const { data: response } = await firstValueFrom(
        this.httpService.get(
          `https://api.safe2pay.com.br/v2/Transaction/Get?Id=${transaction_id}`,
          {
            headers: this.headers,
          },
        ),
      );

      if (response.HasError) {
        throw new ClientException(response.Error);
      }

      const data = response.ResponseDetail;

      return {
        status: this.convertStatus(data.Status),
        external_reference: data.Reference,
        payment_id: data.IdTransaction,
        total_paid_amount: data.Amount,
        date_approved: data.Date,
        transaction_amount: data.Amount,
        net_received_amount: data.NetValue,
        status_detail: this.convertStatus(data.Status),
      };
    } catch (error) {
      console.log(error);
      throw new ClientException(error);
    }
  }

  convertStatus(status: string): string {
    switch (status) {
      case '1':
      case '2':
        return 'PENDING';
      case '3':
        return 'AUTHORIZED';
      case '5':
        return 'IN_DISPUTE';
      case '6':
        return 'REFUNDED';
      case '8':
        return 'REJECTED';
      case '11':
        return 'WAITING_PAYMENT';
      case '12':
        return 'IN_CANCELATION';
      case '13':
        return 'CHARGEBACK';
      case '14':
        return 'PRE_AUTHORIZED';
      case '18':
        return 'ABORTED';
      default:
        return 'pending';
    }
  }
}
