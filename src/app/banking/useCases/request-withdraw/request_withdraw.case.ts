import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as dayjs from 'dayjs';
import { GetAccountBalanceCase } from '../get-account-balance/get_account_balance.case';
import { RequestWithdrawDTO } from './request_withdraw.dto';
import { ProcessWithdrawCase } from '../process-withdraw/process_withdraw.case';
@Injectable()
export class RequestWithdrawCase {
  constructor(
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly getAccountBalanceCase: GetAccountBalanceCase,
    @InjectQueue('withdraw_request') private withdrawQueue: Queue,
    private readonly processWithdawCase: ProcessWithdrawCase,
  ) {}

  async execute({
    user_id,
    value,
    account_id,
  }: RequestWithdrawDTO): Promise<any> {
    const [userBankingAccout, last_withdraw] = await Promise.all([
      this.userBankingAccountsRepository.findBy({
        where: { user_id, id: account_id },
        cache: {
          id: `userBankingAccounts:${account_id}`,
          milliseconds: 1000 * 60 * 5, // 5 minutes
        },
      }),

      this.withdrawalsRepository.find({
        where: { user_id },
        order: { createdAt: 'DESC' },
        take: 1,
      }),
    ]);

    if (!userBankingAccout)
      throw new ClientException('Essa conta bancária não existe');

    // se o último saque foi feito a menos de 30 minutos atrás retornar um erro
    if (last_withdraw.length > 0) {
      const lastWithdraw = last_withdraw[0];
      if (dayjs().diff(dayjs(lastWithdraw.createdAt), 'minute') < 210)
        throw new ClientException(
          'Você fez um saque a menos de 30 minutos, tente novamente mais tarde',
        );
    }

    const balance_details = await this.getAccountBalanceCase.execute(user_id);

    if (balance_details.available_balance < value)
      throw new ClientException('Você não possui saldo suficiente');

    this.withdrawQueue.add({
      user_id,
      value,
      account_id,
    });

    // await this.processWithdawCase.execute({ user_id, value, account_id });

    return;
  }
}
