import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StartSessionCase } from '../start-session/start_session.case';
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
    private readonly startSessionCase: StartSessionCase,
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
    let session = (await this.cacheManager.get('paggueio_session')) as {
      access_token: string;
    };

    if (!session || !session.access_token) {
      const newData = await this.startSessionCase.execute();
      if (!newData || !newData.access_token) {
        return {
          success: false,
          message: 'Error starting paggueio session',
        };
      }

      session = newData;
    }

    try {
      const request_data = {
        amount: Math.round(total_amount * 100),
        payer_name: this.formatName(payer.first_name, payer.last_name),

        expiration: Math.floor(
          (new Date(date_expiration).getTime() - Date.now()) / 1000,
        ), // seconds
        external_id: transaction_id,
        description: `Pagamento de ${items[0]?.title}`,
      };

      const request = await this.httpService.axiosRef.post(
        '/billing_order',
        request_data,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'X-Company-ID': this.configService.get('paggueio.company_id'),
          },
        },
      );

      const data: CreatePixPaymentResponseDTO = request.data;

      return {
        success: true,
        data: {
          expiration_date: data.expiration_at,
          payment_id: data.external_id,
          pix_key: data.payment,
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
