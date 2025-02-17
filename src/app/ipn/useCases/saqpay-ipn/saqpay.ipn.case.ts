import { ConfigService } from '@nestjs/config';

import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import axios from 'axios';

@Injectable()
export class SaqPayIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: {
    transaction_id: string;
    partner_conciliation_id: string;
    transaction_amount: number;
    ipn_secret: string;
    transaction_status: string;
    payment_date: string;
  }): Promise<any> {
    try {
      await axios.post(
        'https://discord.com/api/webhooks/1228555263418699808/MejTjui2AX7M8gdZSHkfaVtumIT-D32tn7tGiJEe7SKqa0NCYols80S__r6_P1K121sB',
        {
          content: JSON.stringify(data),
        },
      );

      if (this.configService.get('saqpay.ipn_secret') !== data.ipn_secret) {
        await axios.post(
          'https://discord.com/api/webhooks/1228486123291021343/U8RdvERvOw0ZXP_9eqjRJFDJRKtmWxIhsMt6MSY3z3vEssJ9JQiztM-teTSItBaeDBSk',
          {
            content: 'SAQPAY - UNAUTHORIZED IPN ' + JSON.stringify(data),
          },
        );
        throw new ClientException('Unauthorized ipn', 404);
      }
      const { partner_conciliation_id } = data;

      const transaction = await this.transactionsRepository.find({
        where: {
          id: String(partner_conciliation_id),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }
      const transactionModel = new Transaction(transaction);

      const status = {
        Aprovado: `AUTHORIZED`,
      };

      if (status[data.transaction_status] === transaction.status) {
        return;
      }

      return await this.createTransactionIpnCase.execute({
        payment_data: {
          total_paid_amount: Number(data.transaction_amount),
          external_reference: data.transaction_id,
          payment_id: data.transaction_id,
          status: status[data.transaction_status],
          status_detail: status[data.transaction_status],
          transaction_amount: Number(data.transaction_amount),
          date_approved: String(new Date(data.payment_date)),
        },
        transaction: transactionModel,
        status: status[data.transaction_status],
      });
    } catch (err) {
      await axios.post(
        'https://discord.com/api/webhooks/1228486123291021343/U8RdvERvOw0ZXP_9eqjRJFDJRKtmWxIhsMt6MSY3z3vEssJ9JQiztM-teTSItBaeDBSk',
        {
          content: 'SERVER EXCEPTION: ' + JSON.stringify(err),
        },
      );
      throw new ServerException(err.message, data);
    }
  }
}
