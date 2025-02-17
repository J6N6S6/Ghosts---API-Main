import { BaseIpnTransaction } from '@/app/ipn/dtos/base_ipn_transaction';
import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import {
  TransactionsRepository,
  UserBankingTransactionsRepository,
} from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { RemoveProductsCase } from '../../remove-products/remove_products.case';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UserBankingSecureReserveModel } from '@/domain/models/user_secure_reserve.model';

@Injectable()
export class DisputeAcceptedPaymentCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly removeProducts: RemoveProductsCase,
    private readonly userSecureReserveRepository: IEUserSecureReserveRepository,
  ) {}

  async execute({ transaction }: BaseIpnTransaction) {
    transaction.status = 'DISPUTE_ACCEPTED';
    transaction.transaction_details = {
      ...transaction.transaction_details,
      net_received_amount:
        transaction?.transaction_details.net_received_amount * -1 || 0,
      total_paid_amount: 0,
    };
    transaction.forced_status = true;

    await this.removeProducts.execute({
      transaction_id: transaction.id,
    });

    transaction.metadata = {
      ...transaction.metadata,
      refund_date: new Date(),
      delivery: false,
    };

    const spliteds = [];

    const split_promises = transaction.split_accounts.map(async (split) => {
      const balance =
        await this.userBankingTransactionsRepository.getBalanceByUserId(
          split.account_id,
        );

      let chargeback_id = null;

      if (split.paid) {
        const secure_reserve_of_transaction =
          await this.userSecureReserveRepository.findOne({
            where: {
              original_transaction_id: transaction.id,
            },
          });

        secure_reserve_of_transaction.status = 'chargeback';

        const secure_reserve_of_transaction_to_update =
          new UserBankingSecureReserveModel(secure_reserve_of_transaction);

        const currentReservedAmount =
          await this.userSecureReserveRepository.getReservedAmountByUserId(
            split.account_id,
          );

        const secure_reserve_chargeback = new UserBankingSecureReserveModel({
          old_total_amount_reserved: currentReservedAmount,
          total_amount_reserved:
            currentReservedAmount - split.secure_reserve_value,

          status: 'chargeback',
          user_id: split.account_id,
          value: split.secure_reserve_value,
          transaction: transaction,
          original_transaction_id: transaction.id,
          operation_type: 'expense',
        });

        const chargeback_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: split.amount,
          old_balance: balance,
          operation_type: 'expense',
          transaction_type: 'chargeback',
          discounts: [
            {
              type: 'tax-sale',
              name: 'Cancelamento da Taxa de recebimento',
              amount: split.amount_tax,
            },
          ],
          balance: balance - split.amount,
          reference_id: transaction.id,
          original_transaction_id: split.account_transaction_id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await Promise.all([
          this.userBankingTransactionsRepository.create(chargeback_balance),
          this.userSecureReserveRepository.create(secure_reserve_chargeback),
          this.userSecureReserveRepository.update(
            secure_reserve_of_transaction_to_update,
          ),
        ]);

        chargeback_id = chargeback_balance.id;
      }

      spliteds.push({
        ...split,
        account_transaction_id: chargeback_id
          ? chargeback_id
          : split.account_transaction_id,
        paid: chargeback_id ? false : split.paid,
        amount_paid: chargeback_id ? 0 : split.amount,
        amount_refunded: chargeback_id ? split.amount : 0,
      });
    });

    transaction.split_accounts = spliteds;

    await Promise.all(split_promises);

    await this.transactionsRepository.update(transaction);

    return transaction;
  }
}
