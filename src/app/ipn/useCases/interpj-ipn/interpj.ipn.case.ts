import { PaymentService } from '@/app/gateways/services/payment.service';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import { InterPJIpn } from '@/app/gateways/providers/inter-bank/dtos/InterPJIpn.dto';

@Injectable()
export class InterpjIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
  ) {}

  async execute(data: InterPJIpn): Promise<any> {
    try {
      const { txid } = data;

      const transaction = await this.transactionsRepository.find({
        where: {
          external_id: String(txid),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const payment_data = await this.paymentService.getTransactionStatus(
        String(txid),
        GatewayProvider.INTER_BANK,
      );

      if (!payment_data) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const transactionModel = new Transaction(transaction);
      return await this.createTransactionIpnCase.execute({
        payment_data,
        transaction: transactionModel,
        status: payment_data.status,
      });
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ServerException(err.message, data);
    }
  }
}
