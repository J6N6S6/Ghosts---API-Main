import { ClientException } from '@/infra/exception/client.exception';
import { UserBankingAccount } from '@/domain/models/user_banking_account.model';
import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { CreateBankAccountDTO } from '../../dtos/CreateBankAccountDTO';

@Injectable()
export class CreateBankAccountCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
  ) {}

  async execute({
    bank_name,
    is_corporate,
    pix_key,
    pix_type,
    user_id,
    name,
    bank_account,
    bank_account_type,
    bank_agency,
  }: CreateBankAccountDTO): Promise<any> {
    try {
      const userData = await this.usersRepository.findById(user_id);

      if (!userData) throw new ClientException('Usuário não encontrado!');

      const accounts = await this.userBankingAccountsRepository.findByUserId(
        user_id,
      );

      if (accounts.length >= 5)
        throw new ClientException(
          'Você já possui 5 contas bancárias cadastradas!',
        );

      const bankAccount = new UserBankingAccount({
        user_id,
        is_corporate,
        pix_key,
        pix_type,
        name,
        bank_name,
        bank_agency,
        bank_account,
        bank_account_type,
      });

      await this.userBankingAccountsRepository.create(bankAccount);
    } catch (err) {
      throw new ClientException(err.message, err);
    }
  }
}
