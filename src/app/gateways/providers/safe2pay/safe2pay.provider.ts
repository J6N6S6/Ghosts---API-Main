import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { ServerException } from '@/infra/exception/server.exception';
import { CreatePaymentOrder } from '../../../ipn/dtos/create_payment_order';
import { PaymentOrderResponse } from '../../../ipn/dtos/payment_order_response';

const PaymentMethods = {
  BANK_SLIP: '1',
  CREDIT_CARD: '2',
  PIX: '6',
};

@Injectable()
export class Safe2PayProvider {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.headers = {
      'x-api-key': String(
        process.env.SAFE2PAY_MODE === 'production'
          ? String(process.env.SAFE2PAY_PRODUCTION_KEY)
          : String(process.env.SAFE2PAY_SANDBOX_KEY),
      ),
    };
  }

  async createPayment(data: CreatePaymentOrder): Promise<PaymentOrderResponse> {
    try {
      const payment_data = {
        ...data,
        ...this.configService.get('safe2pay'),
        Customer: {
          ...data.Customer,
          Address:
            data.Customer.Address || this.configService.get('safe2pay.Address'),
        },

        PaymentMethod: PaymentMethods[data.PaymentMethod],
      };

      const { data: paymentOrder } = await firstValueFrom(
        this.httpService.post<PaymentOrderResponse>(
          'https://payment.safe2pay.com.br/v2/Payment',
          payment_data,
          {
            headers: this.headers,
          },
        ),
      );

      return paymentOrder;
    } catch (error) {
      console.log(error);
      throw new ServerException(error, {
        ...data,
        provider: 'safe2pay',
      });
    }
  }

  async cancelPayment({
    payment_id,
    payment_method,
  }: {
    payment_method: string;
    payment_id: string;
  }): Promise<boolean> {
    const slug = payment_method === 'CREDIT_CARD' ? 'CreditCard' : 'Pix';

    try {
      const { data: response } = await firstValueFrom(
        this.httpService.delete(
          `https://api.safe2pay.com.br/v2/${slug}/Cancel/${payment_id}`,
          {
            headers: this.headers,
          },
        ),
      );

      return response.HasError;
    } catch (error) {
      console.log(error);
      throw new ServerException(error, {
        provider: 'safe2pay',
        payment_id,
        payment_method,
      });
    }
  }

  async getTransactionStatus(transaction_id: string): Promise<any> {
    try {
      const { data: response } = await firstValueFrom(
        this.httpService.get(
          `https://api.safe2pay.com.br/v2/Transaction/Get?Id=${transaction_id}`,
          {
            headers: this.headers,
          },
        ),
      );

      return response;
    } catch (error) {
      console.log(error);
      throw new ServerException(error, {
        provider: 'safe2pay',
        transaction_id,
      });
    }
  }
}
