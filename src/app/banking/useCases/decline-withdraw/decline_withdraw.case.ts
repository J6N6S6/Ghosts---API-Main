import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { Withdraw } from '@/domain/models/withdraw.model';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeclineWithdrawDTO } from './decline_withdraw.dto';

@Injectable()
export class DeclineWithdrawCase {
  constructor(
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user_id,
    withdraw_id,
    reason,
  }: DeclineWithdrawDTO): Promise<any> {
    const withdraw = await this.withdrawalsRepository.findById(withdraw_id);

    if (!withdraw) throw new ClientException('Saque não encontrado');

    const withdrawModel = new Withdraw(withdraw);

    if (withdrawModel.status !== 'pending')
      throw new ClientException('Este saque já foi aprovado');

    withdrawModel.status = 'rejected';
    withdrawModel.reason = reason || null;
    withdrawModel.approved_by = user_id;

    await this.withdrawalsRepository.update(withdrawModel);

    const transaction = await this.userBankingTransactionsRepository.findOne({
      where: {
        id: withdrawModel.transaction_id,
      },
    });

    if (!transaction) throw new ClientException('Transação não encontrada');

    const userBalance =
      await this.userBankingTransactionsRepository.getBalanceByUserId(
        withdraw.user_id,
      );

    const newTransaction = new UserBankingTransaction({
      user_id: withdraw.user_id,
      balance: userBalance + transaction.value,
      old_balance: userBalance,
      discounts: transaction.discounts.map((discount) => ({
        amount: discount.amount,
        name: 'Cancelamento de taxa de saque',
        type: discount.type,
      })),
      operation_type: 'income',
      transaction_type: 'deposit',
      value: transaction.value,
      original_transaction_id: transaction.id,
    });

    await this.userBankingTransactionsRepository.create(newTransaction);
    this.eventEmitter.emit('notification.send', {
      user_id,
      body: `Não foi possivel aprovar seu saque. Motivo: ${
        reason || 'Não informado'
      }`,
      icon: 'error',
      important: false,
    });

    this.eventEmitter.emit('push_notification.send', {
      user_id: withdrawModel.user_id,
      notification: {
        title: 'Seu saque foi reprovado',
        body: 'Acesse a dashboard para mais informações.',
      },
    });
  }
}
