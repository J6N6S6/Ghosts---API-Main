import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StartPagstarSessionCase } from '../start-pagstar-session/start_pagstar_session.case';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class CreatePixPaymentCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly startPagstarSessionCase: StartPagstarSessionCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({
    payer,
    date_expiration,
    total_amount,
    transaction_id,
    seller_name,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    let session = (await this.cacheManager.get('pagstar_session')) as {
      access_token: string;
    };

    if (!session || !session.access_token) {
      const newData = await this.startPagstarSessionCase.execute();
      if (!newData || !newData.access_token) {
        return {
          success: false,
          message: 'Error starting pagstar session',
        };
      }

      session = newData;
    }

    try {
      const request_data = {
        value: total_amount,
        name: this.formatName(payer.first_name, payer.last_name),
        document: payer.identification.number,
        tenant_id: this.configService.get<string>('pagstar.tenant_id'),
        expiration: Math.floor(
          (new Date(date_expiration).getTime() - Date.now()) / 1000,
        ), // seconds
        transaction_id,
        description: `Compra de produtos de ${seller_name}.`,
      };

      const request = await this.httpService.axiosRef.post(
        '/v2/wallet/partner/transactions/generate-anonymous-pix',
        request_data,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const { data } = request.data;

      return {
        success: true,
        data: {
          expiration_date: data.expiration_date,
          payment_id: data.external_reference,
          pix_key: data.pix_key,
          status: 'PENDING',
          status_detail: 'WAITING_PAYMENT',
          total_transaction_value: total_amount,
        },
      };
    } catch (error) {
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
