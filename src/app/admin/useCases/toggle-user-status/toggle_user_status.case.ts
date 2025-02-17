import { User } from '@/domain/models/users.model';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { In, MoreThan } from 'typeorm';

@Injectable()
export class ToggleUserStatusCase {
  constructor(
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly userSecureReserveRespository: IEUserSecureReserveRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(user_id: string) {
    const user = await this.usersRepository.findBy({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new ClientException('User not found');
    }

    const updatedUser = new User({ ...user });

    if (user.blocked_access) {
      updatedUser.blocked_access = false;
    } else {
      updatedUser.blocked_access = true;
    }

    await this.usersRepository.update(updatedUser);

    return {
      message: 'User status toggled successfully',
    };
  }
}
