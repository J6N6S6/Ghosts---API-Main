import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { Injectable } from '@nestjs/common';

import {
  TaxesRepository,
  UserBankingTransactionsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Taxes } from '@/infra/database/entities/taxes.entity';

@Injectable()
export class GetUserTaxesCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly taxesRepository: TaxesRepository,
  ) {}

  async execute(user_id: string): Promise<Taxes> {
    try {
      console.log('user_id', user_id);
      const user = await this.usersRepository.findBy({
        where: { id: user_id },
      });

      if (!user) {
        throw new ClientException('User not found');
      }

      const taxes = await this.taxesRepository.findById(user.tax_config);

      if (!taxes) {
        throw new ClientException('Taxes not found');
      }

      return taxes;
    } catch (error) {
      console.error(error);
    }
  }
}
