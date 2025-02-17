import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment } from 'mercadopago';

@Injectable()
export class GetTransactionStatusCase {
  private client: MercadoPagoConfig;
  constructor(private readonly configService: ConfigService) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('mercado_pago.access_token'),
    });
  }

  async execute(transaction_id: string): Promise<GetStatusPayment> {
    const payment = new Payment(this.client);

    const payment_status = await payment.get({
      id: transaction_id,
    });

    return {
      status: payment_status.status.toUpperCase(),
      status_detail: payment_status.status_detail.toUpperCase(),
      external_reference: payment_status.external_reference,
      payment_id: String(payment_status.id),
      total_paid_amount: payment_status.transaction_amount,
      transaction_amount: payment_status.transaction_amount,
      date_approved: payment_status.date_approved,
    };
  }
}
