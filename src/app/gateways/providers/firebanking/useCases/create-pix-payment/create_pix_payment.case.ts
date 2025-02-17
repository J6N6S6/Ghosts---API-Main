import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { CreatePixPaymentResponseDTO } from './create_pix_payment_response.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class CreatePixPaymentCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({
    payer,
    date_expiration,
    total_amount,
    transaction_id,
    seller_name,
    items,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    try {
      const request_data = {
        type: 'PIX',
        payer: {
          fullName: this.formatName(payer.first_name, payer.last_name),
          document: payer.identification.number,
          contact: {
            phone: `+55${payer.phone.area_code}${payer.phone.number}`,
            email: payer.email,
          },
        },
        transaction: {
          value: total_amount,
          description: `Pagamento de ${items[0]?.title}`,
          external_id: transaction_id,
        },

        // seconds
      };

      const request = await this.httpService.axiosRef.post(
        '/payment',
        request_data,
        {
          headers: {
            apiKey: this.configService.get('firebanking.api_key'),
          },
        },
      );

      const data: CreatePixPaymentResponseDTO = request.data;

      const date = new Date(data.generateTime);

      // Adiciona 30 minutos (30 * 60 * 1000 milissegundos)
      date.setTime(date.getTime() + 30 * 60 * 1000);

      const expirationDate = date.toISOString();
      return {
        success: true,
        data: {
          expiration_date: expirationDate,
          payment_id: data.transactionId,
          pix_key: data.pixCode,
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
          total_transaction_value: total_amount,
        },
      };
    } catch (error) {
      console.log(error);
      const msg_error = error?.response?.data?.message || error.message;

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
