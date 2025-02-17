import { PaymentService } from '@/app/gateways/services/payment.service';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { ISafe2PayIpn } from '../../dtos/safe2pay_ipn';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';

@Injectable()
export class Safe2PayIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
  ) {}

  async execute(data: ISafe2PayIpn): Promise<any> {
    try {
      const { IdTransaction, SecretKey, Reference } = data;

      if (SecretKey !== process.env.SAFE2PAY_SECRET_KEY) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const transaction_id = Reference.split('-card')[0];

      const transaction = await this.transactionsRepository.find({
        where: {
          id: String(transaction_id),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const payment_data = await this.paymentService.getTransactionStatus(
        String(IdTransaction),
        GatewayProvider.SAFE2PAY,
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
      throw new ServerException(err.message, {
        ...data,
      });
    }
  }
}
