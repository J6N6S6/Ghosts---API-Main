import { ClientException } from '@/infra/exception/client.exception';
import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetBankAccountCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
  ) {}

  async execute(user_id: string): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    const accounts = await this.userBankingAccountsRepository.findByUserId(
      user_id,
    );

    const accounts_user = accounts.map((account) => {
      return {
        ...account,
        user_id: undefined,
        additional_data: undefined,
        identity: user.cpf || user.cnpj,
      };
    });

    return accounts_user;
  }
}
