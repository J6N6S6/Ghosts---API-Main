import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class UpdateUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    additional_info,
    address,
    name,
    name_exibition,
    user_id,
    cpf,
    cnpj,
    rg,
  }: UpdateUserDTO): Promise<any> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new ClientException('Usuário não encontrado');
    }

    const user = new User(userExists);

    if (name) user.name = name;

    if (name_exibition) user.name_exibition = name_exibition;
    if (additional_info) {
      const old_additional_info = user.additional_info;
      user.additional_info = {
        ...old_additional_info,
        ...additional_info,
      };
    }

    if (address) user.address = address;
    if (cpf) {
      if (userExists.person_type === 'PJ')
        throw new ClientException('Usuário não pode ter CPF');

      if (userExists.cpf && userExists.cpf !== cpf)
        throw new ClientException('Usuário já possui CPF cadastrado');

      user.cpf = cpf;
    }

    if (cnpj) {
      if (userExists.person_type === 'PF')
        throw new ClientException('Usuário não pode ter CNPJ');

      if (userExists.cnpj && userExists.cnpj !== cnpj)
        throw new ClientException('Usuário já possui CNPJ cadastrado');

      user.cnpj = cnpj;
    }

    if (rg) {
      if (userExists.rg && userExists.rg !== rg)
        throw new ClientException('Usuário já possui RG cadastrado');

      user.rg = rg;
    }

    await this.usersRepository.update(user);
  }
}
