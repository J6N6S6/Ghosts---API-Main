import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { Withdraw } from '@/domain/models/withdraw.model';
import { TaxesRepository } from '@/domain/repositories/taxes.repository';
import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as dayjs from 'dayjs';
import { GetAccountBalanceCase } from '../get-account-balance/get_account_balance.case';
import { ProcessWithdrawDTO } from './process_withdraw.dto';

@Injectable()
export class ProcessWithdrawCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly taxesRepository: TaxesRepository,
    private readonly getAccountBalanceCase: GetAccountBalanceCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user_id,
    value,
    account_id,
  }: ProcessWithdrawDTO): Promise<any> {
    if (value < 100)
      throw new ClientException('O valor minimo de saque é de R$ 100,00');

    const userBankingAccout = await this.userBankingAccountsRepository.findBy({
      where: { user_id, id: account_id },
      cache: {
        id: `userBankingAccounts:${account_id}`,
        milliseconds: 1000 * 60 * 5, // 5 minutes
      },
    });

    const user = await this.usersRepository.findBy({
      where: { id: user_id },
      cache: {
        id: `users:${user_id}`,
        milliseconds: 1000 * 60 * 5, // 5 minutes
      },
    });

    if (!userBankingAccout || !user)
      throw new ClientException('Essa conta bancária não existe');

    const last_withdraw = await this.withdrawalsRepository.find({
      where: { user_id },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    // se o último saque foi feito a menos de 30 minutos atrás retornar um erro
    if (last_withdraw.length > 0) {
      const lastWithdraw = last_withdraw[0];
      if (dayjs().diff(dayjs(lastWithdraw.createdAt), 'minute') < 210)
        throw new ClientException(
          'Você fez um saque a menos de 30 minutos, tente novamente mais tarde',
        );
    }

    const [balance, balance_details, taxes] = await Promise.all([
      this.userBankingTransactionsRepository.getBalanceByUserId(user_id),
      this.getAccountBalanceCase.execute(user_id, true),
      await this.taxesRepository.findById(user.tax_config),
    ]);

    if (balance_details.available_balance < value)
      throw new ClientException('Você não possui saldo suficiente');

    // balanceWithDiscounts is value - percentage_tax - fixed_tax
    const balanceWithDiscounts =
      value -
      (value * taxes.withdrawal_fee.percentage) / 100 -
      taxes.withdrawal_fee.fixed_amount;

    const transaction = await this.userBankingTransactionsRepository.create(
      new UserBankingTransaction({
        user_id,
        value,
        transaction_type: 'withdrawal',
        balance: balance - value,
        old_balance: balance,
        discounts: [
          {
            type: 'withdrawal-tax',
            amount:
              (value * taxes.withdrawal_fee.percentage) / 100 +
              taxes.withdrawal_fee.fixed_amount,
            name: 'Taxa de saque',
          },
        ],
        operation_type: 'expense',
        liquidation_date: null,
      }),
    );
    await this.withdrawalsRepository.create(
      new Withdraw({
        amount: balanceWithDiscounts,
        status: 'pending',
        user_id,
        bank_account: {
          pix_key: userBankingAccout.pix_key,
          pix_type: userBankingAccout.pix_type,
          is_corporate: userBankingAccout.is_corporate,
          bank_name: userBankingAccout.bank_name,
          bank_agency: userBankingAccout.bank_agency,
          bank_account: userBankingAccout.bank_account,
          bank_account_type: userBankingAccout.bank_account_type,
        },
        transaction_id: transaction.id,
      }),
    );

    this.eventEmitter.emit('notification.send', {
      user_id,
      body: `Recebemos sua solicitação de saque.`,
      icon: 'info',
      important: false,
    });

    this.eventEmitter.emit('push_notification.send', {
      user_id,
      notification: {
        title: 'Solicitação de saque',
        body: 'Sua solicitação de saque foi recebida. Você será notificado assim que o valor for enviado.',
      },
    });
  }
}
