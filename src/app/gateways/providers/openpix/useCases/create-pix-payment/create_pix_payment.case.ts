import { CreatePixPaymentDTO } from '@/app/gateways/dtos/CreatePixPayment.dto';
import { PixPaymentResponse } from '@/app/gateways/dtos/PixPaymentResponse.dto';
import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreatePixPaymentCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({
    total_amount,
    transaction_id,
    seller_name,
    items,
  }: CreatePixPaymentDTO): Promise<PixPaymentResponse> {
    try {
      const request_data = {
        value: Math.round(total_amount * 100), // OBS: O VALUE É EM CENTAVOS O * 100
        name: `${items[0]?.title}`,
        correlationID: transaction_id,
        comment: `${items[0]?.title}.`,
      };

      const request = await this.httpService.axiosRef.post(
        '/charge',
        request_data,
      );

      const { charge } = request.data;

      return {
        success: true,
        data: {
          expiration_date: null,
          payment_id: charge.transactionID,
          pix_key: charge.brCode,
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
