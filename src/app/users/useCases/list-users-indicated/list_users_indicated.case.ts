import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

interface ListUserIndicatedDTO {
  user_id: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListUsersIndicatedCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ limit = 10, page = 1, user_id }: ListUserIndicatedDTO) {
    if (page <= 0) throw new ClientException('Página inválida');
    if (limit < 10 || limit > 25)
      throw new ClientException('O limite deve ser entre 10 e 25 itens');

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    const users_indicated = await this.usersRepository.findAllByIndicatedBy(
      user_id,
      page,
      limit,
    );

    return {
      page: Number(page),
      limit: Number(limit),
      total_data: users_indicated.count,
      data: users_indicated.data,
      total_pages: Math.ceil(users_indicated.count / limit),
    };
  }
}
