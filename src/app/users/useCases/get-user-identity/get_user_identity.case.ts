import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserIdentityCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user_id: string) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    return {
      person_type: user.person_type,
      cpf: user.cpf,
      cnpj: user.cnpj,
      rg: user.rg,
    };
  }
}
