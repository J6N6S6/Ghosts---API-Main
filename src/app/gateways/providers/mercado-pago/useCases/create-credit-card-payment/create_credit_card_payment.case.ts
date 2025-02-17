import { CreateCreditCardPaymentDTO } from '@/app/gateways/dtos/CreateCreditCardPayment.dto';
import { CreditCardPaymentResponse } from '@/app/gateways/dtos/CreditCardPaymentResponse.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment } from 'mercadopago';

@Injectable()
export class CreateCreditCardPaymentCase {
  private client: MercadoPagoConfig;
  constructor(private readonly configService: ConfigService) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('mercado_pago.access_token'),
    });
  }

  async execute({
    payer,
    items,
    total_amount,
    transaction_id,
    card_token,
    installments,
    seller_name,
    token,
  }: CreateCreditCardPaymentDTO): Promise<CreditCardPaymentResponse> {
    if (!card_token) {
      return {
        success: false,
        error: 'card_token is required',
        message: 'card_token is required',
      };
    }

    const payment = new Payment(this.client);

    const body = {
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
      capture: true,
      token,
      installments,
      description: `Compra de produtos de ${seller_name}`,
      statement_descriptor: 'LIMO',
      // three_d_secure_mode: 'optional',
    };

    try {
      const response = await payment.create({ body });
      return {
        success: true,
        data: {
          payment_id: String(response.id),
          total_transaction_value: total_amount,
          status: response.status.toUpperCase(),
          status_detail: response.status_detail.toUpperCase(),
          authorization_code: response.authorization_code,
          brand: response.card.bin,
          capture: response.captured,
          net_value: response.net_amount,
          total_paid: response.transaction_amount,
          use_tds: response.status_detail === 'pending_challenge',
          three_ds_info: response.three_ds_info,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.error,
        message: error.message,
      };
    }
  }
}
