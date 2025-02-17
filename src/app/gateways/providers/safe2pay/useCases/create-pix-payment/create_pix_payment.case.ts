import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { PaymentOrderResponse } from '@/app/ipn/dtos/payment_order_response';
import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreatePixPaymentCase {
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

  async execute({
    payer,
    items,
    date_expiration,
    total_amount,
    transaction_id,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    try {
      const total_value_items = items.reduce((acc, item) => {
        acc += item.unit_price * item.quantity;
        return acc;
      }, 0);

      const payment_data = {
        ...this.configService.get('safe2pay'),
        Application: 'Sunize Digital',
        Vendor: 'Sunize Digital',
        Reference: transaction_id,
        Customer: {
          Name: `${payer.first_name} ${payer.last_name}`,
          Email: payer.email,
          Identity: payer.identification.number,
          Phone: payer.phone,
          Address:
            (payer.address && {
              ZipCode: payer.address.zip_code,
              Street: payer.address.street_name,
              Number: payer.address.street_number,
              Complement: payer.address.neighborhood,
              District: payer.address.city,
              CityName: payer.address.federal_unit,
              StateInitials: payer.address.federal_unit,
              CountryName: payer.address.country,
            }) ||
            this.configService.get('safe2pay.Address'),
        },
        Products:
          total_value_items === total_amount
            ? items.map((item) => ({
                Code: item.id,
                Description: item.title,
                Quantity: item.quantity,
                UnitPrice: item.unit_price,
              }))
            : [
                {
                  Code: items[0].id || '1',
                  Description: items[0].title || 'Venda de produto',
                  Quantity: 1,
                  UnitPrice: total_amount,
                },
              ],
        PaymentMethod: '6',
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

      if (paymentOrder.HasError)
        return {
          success: false,
          error: paymentOrder.ErrorCode,
          message: paymentOrder.Error,
        };

      const { ResponseDetail: data } = paymentOrder;

      return {
        success: true,
        data: {
          payment_id: data.IdTransaction,
          pix_key: data.QrCode,
          total_transaction_value: total_amount,
          expiration_date: date_expiration,
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
        },
      };
    } catch (error) {
      console.log(error);
      throw new ServerException(error, {
        payer,
        items,
        date_expiration,
        total_amount,
        transaction_id,
      });
    }
  }
}
