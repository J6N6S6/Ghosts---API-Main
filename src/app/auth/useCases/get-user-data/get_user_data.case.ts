import { ClientException } from '@/infra/exception/client.exception';
import { UsersRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserDataCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user_id: string) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ClientException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      cnpj: user.cnpj,
      person_type: user.person_type,
      documentStatus: user.documentStatus,
    };
  }
}
