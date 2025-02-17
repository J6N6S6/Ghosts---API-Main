import { ConfigService } from '@nestjs/config';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import axios from 'axios';
import { OpenPixIpnDTO } from './openpix.ipn.dto';

@Injectable()
export class OpenPixIpnCase {
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

  async execute(data: OpenPixIpnDTO): Promise<void> {
    const { charge } = data;

    try {
      await this.sendToDiscord(
        'OPEN PIX ' + JSON.stringify(data),
        this.discordWebhookUrl,
      );

      if (this.configService.get('openpix.ipn_secret') !== data.ipn_secret) {
        await this.sendToDiscord(
          'OPENPIX - UNAUTHORIZED IPN ' + JSON.stringify(data),
          this.unauthorizedWebhookUrl,
        );
        throw new ClientException('Unauthorized ipn', 404);
      }

      const transaction = await this.transactionsRepository.find({
        where: { id: String(charge.correlationID) },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const transactionModel = new Transaction(transaction);

      const status = { COMPLETED: `AUTHORIZED` };

      if (status[data.charge.status] === transaction.status) {
        return;
      }

      const paymentData = {
        total_paid_amount: charge.value * 100,
        external_reference: charge.transactionID,
        payment_id: charge.transactionID,
        status: status[charge.status],
        status_detail: status[charge.status],
        transaction_amount: charge.value * 100,
        date_approved: String(new Date(charge.paidAt)),
      };

      await this.createTransactionIpnCase.execute({
        payment_data: paymentData,
        transaction: transactionModel,
        status: status[charge.status],
      });
    } catch (error) {
      await this.sendToDiscord(
        'OPENPIX - ERROR ' + JSON.stringify(data),
        this.errorWebhookUrl,
      );
      throw new ClientException(error, 500);

      // throw new ServerException(error.message, data);
    }
  }
}
