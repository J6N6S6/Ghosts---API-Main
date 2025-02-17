import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';
import { PaymentStatus } from '@/app/ipn/types/payment_status.type';
import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { StartPagstarSessionCase } from '../start-pagstar-session/start_pagstar_session.case';

const status_cases = {
  0: PaymentStatus.PENDING,
  1: PaymentStatus.APPROVED,
  2: PaymentStatus.CANCELLED,
};

@Injectable()
export class GetTransactionStatusCase {
  constructor(
    private readonly httpService: HttpService,
    private readonly startPagstarSessionCase: StartPagstarSessionCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(transaction_id: string): Promise<GetStatusPayment> {
    let session = (await this.cacheManager.get('pagstar_session')) as {
      access_token: string;
    };

    if (!session || !session.access_token) {
      const newData = await this.startPagstarSessionCase.execute();
      if (!newData || !newData.access_token) {
        throw new ServerException('Error starting pagstar session');
      }

      session = newData;
    }

    try {
      const request = await this.httpService.axiosRef.get(
        `/v2/wallet/partner/transactions/${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const { data } = request.data;

      return {
        payment_id: data.external_reference,
        status: status_cases[data.status] || PaymentStatus.ERROR,
        status_detail: status_cases[data.status] || PaymentStatus.ERROR,
        external_reference: data.external_reference,
        total_paid_amount: data.total_paid_amount,
        transaction_amount: data.transaction_amount,
        date_approved: data.created_at,
      };
    } catch (err) {
      const msg_error = err?.response?.data?.message || err.message;
      throw new ServerException(msg_error);
    }
  }
}
