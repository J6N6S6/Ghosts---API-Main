import { CheckoutMetricsService } from '@/app/metrics/services/checkout_metrics.service';
import { ClientException } from '@/infra/exception/client.exception';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { Injectable } from '@nestjs/common';
import * as datefns from 'date-fns';
import { CancelAndRefundTransactionDTO } from './cancel_and_refund_transaction.dto';
import { PaymentService } from '@/app/gateways/services/payment.service';

@Injectable()
export class CancelAndRefundTransactionCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly checkoutMetricsService: CheckoutMetricsService,
  ) {}

  async execute({ user_id, transaction_id }: CancelAndRefundTransactionDTO) {
    const transaction_data = await this.transactionsRepository.findBy({
      id: transaction_id,
      seller_id: user_id,
    });

    if (!transaction_data) {
      throw new ClientException('Transação não encontrada');
    }

    if (transaction_data.status !== 'AUTHORIZED') {
      throw new ClientException('Transação não pode ser estornada');
    }

    const payment_id =
      transaction_data?.transaction_details?.external_transaction_id;

    if (!payment_id) {
      throw new ClientException(
        'Transação não pode ser estornada, entre em contato com o suporte para mais informações',
      );
    }

    for (const user of transaction_data.split_accounts) {
      const userBalance =
        await this.userBankingTransactionsRepository.getBalanceByUserId(
          user.account_id,
        );

      if (userBalance > user.amount) continue;

      const revenue = await this.checkoutMetricsService.getRevenue({
        start_date: datefns.subDays(new Date(), 30),
        end_date: new Date(),
        userId: user.account_id,
      });

      const last30DaysRevenue = revenue.data.total_transactions_approved;

      if (last30DaysRevenue * 0.05 < user.amount) {
        throw new ClientException(
          'Transação não pode ser estornada, pois algum dos participantes não possui saldo suficiente',
        );
      }
    }

    // return await this.paymentService.cancelPayment({
    //   payment_method: transaction_data.payment_method,
    //   payment_id,
    // });
  }
}
