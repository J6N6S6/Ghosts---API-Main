import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { PaymentCreateData } from 'mercadopago/dist/clients/payment/create/types';

@Injectable()
export class CreatePixPaymentCase {
  private client: MercadoPagoConfig;
  constructor(private readonly configService: ConfigService) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('mercado_pago.access_token'),
    });
  }

  async execute({
    payer,
    items,
    date_expiration,
    total_amount,
    transaction_id,
    seller_name,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    const payment = new Payment(this.client);

    const body: PaymentCreateData['body'] = {
      notification_url: this.configService.get<string>(
        'mercado_pago.callback_url',
      ),
      transaction_amount: total_amount,
      external_reference: transaction_id,
      payer: {
        first_name: payer.first_name,
        last_name: payer.last_name,
        email: payer.email,
        phone: payer.phone
          ? {
              area_code: payer.phone.area_code,
              number: payer.phone.number,
            }
          : undefined,
        address: payer.address
          ? {
              zip_code: payer.address.zip_code,
              street_name: payer.address.street_name,
              street_number: payer.address.street_number,
              city: payer.address.city,
              federal_unit: payer.address.federal_unit,
              neighborhood: payer.address.neighborhood,
            }
          : undefined,
      },
      additional_info: {
        items,
        shipments: payer.address
          ? {
              receiver_address: {
                zip_code: payer.address.zip_code,
                street_name: payer.address.street_name,
                street_number: payer.address.street_number,
                city_name: payer.address.city,
                country_name: payer.address.country,
                state_name: payer.address.federal_unit,
              },
            }
          : undefined,
      },
      payment_method_id: 'pix',
      date_of_expiration: date_expiration,
      description: `Pagamento de ${items[0]?.title}`,
      statement_descriptor: 'SUNIZE',
    };

    try {
      const response = await payment.create({ body });
      return {
        success: true,
        data: {
          payment_id: String(response.id),
          pix_key: response.point_of_interaction.transaction_data.qr_code,
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
}
