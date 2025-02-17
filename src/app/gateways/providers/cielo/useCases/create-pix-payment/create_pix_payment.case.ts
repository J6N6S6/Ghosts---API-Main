import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';

import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreatePixPaymentResponseDTO } from './create_pix_payment_response.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class CreatePixPaymentCase {
  constructor(private readonly httpService: HttpService) {}

  async execute({
    payer,
    date_expiration,
    total_amount,
    transaction_id,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    try {
      const request_data = {
        MerchantOrderId: transaction_id,
        Customer: {
          Name: this.formatName(payer.first_name, payer.last_name),
          Identity: payer.identification.number,
          IdentityType: payer.identification.type,
        },
        Payment: {
          Type: 'Pix',
          Amount: total_amount * 100, // cents
        },
      };

      const request = await this.httpService.axiosRef.post(
        '/1/sales',
        request_data,
      );

      const data: CreatePixPaymentResponseDTO = request.data;

      if (!data.Payment) {
        return {
          success: false,
          message: 'Error creating pix payment',
        };
      }

      return {
        success: true,
        data: {
          expiration_date: date_expiration,
          payment_id: data.Payment.PaymentId,
          pix_key: data.Payment.QrCodeString,
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
          total_transaction_value: total_amount,
        },
      };
    } catch (error) {
      console.log(error);
      const msg_error = error?.response?.data?.message || error.message;
      try {
        await axios.post(
          'https://discord.com/api/webhooks/1228555263418699808/MejTjui2AX7M8gdZSHkfaVtumIT-D32tn7tGiJEe7SKqa0NCYols80S__r6_P1K121sB',
          {
            content: 'CIELO - ERROR:' + msg_error,
          },
        );
      } catch (err) {}
      const msg = error.response?.data?.message || error.message;
      console.log(error);
      throw new ClientException(msg);
    }
  }

  formatName(first_name: string, last_name: string): string {
    if (last_name) {
      return first_name + ' ' + last_name;
    }

    return first_name;
  }
}
