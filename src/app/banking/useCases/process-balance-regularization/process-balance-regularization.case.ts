import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UserBankingTransactionsRepository } from '@/domain/repositories';
import { UserBankingSecureReserveModel } from '@/domain/models/user_secure_reserve.model';
import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessBalanceRegularizationCase {
  constructor(
    private readonly userSecureReserveRepository: IEUserSecureReserveRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
  ) {}

  async process(job: any) {
    const transaction = job.data;
    const user_id = transaction.user_id;

    console.log(
      'PROCESSANDO TRANSAÇÃO DE REGULARIZAÇÃO DE SALDO: ',
      transaction,
    );

    try {
      if (transaction.status === 'liquidated') {
        return;
      }

      const [secureReservedcurrentBalance, userAvailableBalance] =
        await Promise.all([
          this.userSecureReserveRepository.getReservedAmountByUserId(user_id),
          this.userBankingTransactionsRepository.getBalanceByUserId(user_id),
        ]);

      transaction.status = 'liquidated';
      transaction.liquidation_date = new Date();

      const secureReserveTransaction = new UserBankingSecureReserveModel(
        transaction,
      );
      await this.userSecureReserveRepository.update(secureReserveTransaction);

      const newTransactionLiquitation = new UserBankingSecureReserveModel({
        user_id: transaction.user_id,
        reference_id: transaction.reference_id,
        old_total_amount_reserved: secureReservedcurrentBalance,
        status: 'liquidated',
        total_amount_reserved: secureReservedcurrentBalance - transaction.value,
        value: transaction.value,
        liquidation_date: new Date(),
        operation_type: 'expense',
      });
      await this.userSecureReserveRepository.create(newTransactionLiquitation);
      const discount = transaction.value * 0.1;
      const transactionDiscountedValue = transaction.value - discount;

      await this.userBankingTransactionsRepository.create(
        new UserBankingTransaction({
          user_id,
          value: transaction.value,
          transaction_type: 'liquidation',
          balance: userAvailableBalance + transactionDiscountedValue,
          old_balance: userAvailableBalance,
          operation_type: 'income',
          liquidation_date: new Date(),
          discounts: [],
          extra_data: {
            reserve_amount_transaction_id: transaction.id,
          },
        }),
      );

      // job.progress(1);
    } catch (error) {
      console.log(
        'ERRO AO PROCESSAR TRANSAÇÃO [REGULARIZATION BALANCE]: ',
        error,
      );
      console.error(error);
    }
  }
}
