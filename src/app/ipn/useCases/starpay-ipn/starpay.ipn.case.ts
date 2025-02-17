import { PaymentService } from '@/app/gateways/services/payment.service';
import { CreateTransactionIpnCase } from '@/app/ipn/useCases/create-transaction-ipn/create_transaction_ipn.case';

import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StarpayIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
    private readonly configService: ConfigService,
  ) {}

  private async sendToDiscord(
    content: string,
    webhookUrl: string,
  ): Promise<void> {
    try {
      await axios.post(webhookUrl, { content });
    } catch (error) {
      // Aqui você pode lidar com o erro de forma específica, se necessário
    }
  }

  async execute({
    idTransaction,
    statusTransaction,
    typeTransaction,
    ipn_secret,
  }: {
    idTransaction: string;
    statusTransaction: string;
    typeTransaction: string;
    ipn_secret: string;
  }): Promise<any> {
    try {
      // if (

      if (
        statusTransaction === 'PIX_CASHOUT' ||
        statusTransaction === 'WAITING_FOR_APPROVAL'
      )
        return;

      const transaction = await this.transactionsRepository.find({
        where: {
          external_id: String(idTransaction),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const status = {
        PAID_OUT: 'AUTHORIZED',
        CANCELED: 'CANCELLED',
        UNPAID: 'CANCELLED',
        CHARGEBACK: 'CHARGEBACK',
        WAITING_FOR_APPROVAL: 'WAITING_PAYMENT',
        PAYMENT_ACCEPT: 'AUTHORIZED',
      }[statusTransaction];

      if (status === transaction.status) return;

      const transactionModel = new Transaction(transaction);

      return this.createTransactionIpnCase.execute({
        payment_data: {
          status: status,
          status_detail: status,
          payment_id: idTransaction,
          external_reference: idTransaction,
          transaction_amount: transactionModel.transaction_amount,
          total_paid_amount:
            status === 'AUTHORIZED' ? transactionModel.transaction_amount : 0,
          net_received_amount:
            status === 'AUTHORIZED' ? transactionModel.transaction_amount : 0,
          date_approved:
            status === 'AUTHORIZED' ? new Date().toISOString() : null,
        },
        transaction: transactionModel,
        status: status,
      });
    } catch (err) {
      this.sendToDiscord(
        'STARPAY - ERROR: ' +
          JSON.stringify(err) +
          ' - ' +
          idTransaction +
          ' ' +
          statusTransaction +
          ' ' +
          typeTransaction +
          ' ',
        'https://discord.com/api/webhooks/1228555263418699808/MejTjui2AX7M8gdZSHkfaVtumIT-D32tn7tGiJEe7SKqa0NCYols80S__r6_P1K121sB',
      );
      throw new ServerException(err.message);
    }
  }
}
