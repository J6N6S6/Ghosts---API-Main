import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
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
  ) {
    this.headers = {
      ci: String(this.configService.get('suitpay.client_id')),
      cs: String(this.configService.get('suitpay.client_secret')),
    };
  }

  async execute({
    payer,
    items,
    date_expiration,
    total_amount,
    transaction_id,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    try {
      const payment_data = {
        requestNumber: transaction_id,
        dueDate: dayjs(date_expiration).format('YYYY-MM-DD'),
        amount: total_amount,
        discountAmount: 0.0,
        callbackUrl: String(this.configService.get('suitpay.callback_url')),
        client: {
          name: payer.last_name
            ? `${payer.first_name} ${payer.last_name}`
            : payer.first_name,
          document: this.formatDocument(payer.identification.number),
          phoneNumber: payer.phone.number,
          email: payer.email,
          address: payer.address
            ? {
                codIbge: '5208707',
                street: payer.address.street_name,
                number: payer.address.street_number,
                complement: '',
                zipCode: payer.address.zip_code,
                neighborhood: payer.address.neighborhood,
                city: payer.address.city,
                state: payer.address.federal_unit,
              }
            : undefined,
        },
        products: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          value: item.unit_price,
        })),
      };

      const { data: paymentOrder } = await firstValueFrom(
        this.httpService.post<PaymentOrderResponse>(
          `https://${
            this.configService.get('suitpay.is_sandbox')
              ? 'sandbox.ws.suitpay.app'
              : 'ws.suitpay.app'
          }/api/v1/gateway/request-qrcode`,
          payment_data,
          {
            headers: this.headers,
          },
        ),
      );

      if (paymentOrder.response === 'ERROR')
        return {
          success: false,
          error: 'PAYMENT_ERROR',
          message: paymentOrder.message,
        };

      this.httpService.axiosRef
        .post('https://api.sunize.com.br/ipn/suitpay', {
          idTransaction: paymentOrder.idTransaction,
          statusTransaction: 'WAITING_FOR_APPROVAL',
          typeTransaction: 'PIX',
        })
        .catch(() => {
          // ignore error
        });

      return {
        success: true,
        data: {
          payment_id: paymentOrder.idTransaction,
          pix_key: paymentOrder.paymentCode,
          total_transaction_value: total_amount,
          expiration_date: date_expiration,
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
        },
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(error);
      throw new ClientException(msg);
    }
  }

  formatDocument(document: string): string {
    // return cpf or cnpj formatted

    const documentLength = document.length;

    if (documentLength === 11) {
      return `${document.slice(0, 3)}.${document.slice(3, 6)}.${document.slice(
        6,
        9,
      )}-${document.slice(9)}`;
    }

    return `${document.slice(0, 2)}.${document.slice(2, 5)}.${document.slice(
      5,
      8,
    )}/${document.slice(8, 12)}-${document.slice(12)}`;
  }
}
