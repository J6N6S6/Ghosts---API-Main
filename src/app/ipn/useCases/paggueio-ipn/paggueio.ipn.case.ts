import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import { PaggueioDTO } from './paggueio.ipn.dto';

@Injectable()
export class PaggueioIpnCase {
  private readonly discordWebhookUrl = 'https://discord.com/api/webhooks/';
  private readonly unauthorizedWebhookUrl = `${this.discordWebhookUrl}1228486123291021343/U8RdvERvOw0ZXP_9eqjRJFDJRKtmWxIhsMt6MSY3z3vEssJ9JQiztM-teTSItBaeDBSk`;
  private readonly errorWebhookUrl = `${this.discordWebhookUrl}1228486123291021343/U8RdvERvOw0ZXP_9eqjRJFDJRKtmWxIhsMt6MSY3z3vEssJ9JQiztM-teTSItBaeDBSk`;

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
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

  async execute(data: PaggueioDTO): Promise<void> {
    try {
      const transaction = await this.transactionsRepository.find({
        where: { id: String(data.external_id) },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const transactionModel = new Transaction(transaction);

      const status = {
        0: 'PENDING',
        1: `AUTHORIZED`,
      };

      if (status[data.status] === transaction.status) {
        return;
      }

      const paymentData = {
        total_paid_amount: data.amount * 100,
        external_reference: data.hash,
        payment_id: data.hash,
        status: status[data.status],
        status_detail: status[data.status],
        transaction_amount: data.amount * 100,
        date_approved: String(new Date(data.paid_at)),
      };

      await this.createTransactionIpnCase.execute({
        payment_data: paymentData,
        transaction: transactionModel,
        status: status[data.status],
      });
    } catch (error) {
      await this.sendToDiscord(
        'PAGGUEIO - ERROR:' +
          JSON.stringify(error) +
          ' - DATA:' +
          JSON.stringify(data),
        this.errorWebhookUrl,
      );
      throw new ServerException(error);

      // throw new ServerException(error.message, data);
    }
  }
}
