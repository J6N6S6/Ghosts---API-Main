import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user_id: string) {
    const user = await this.usersRepository.findById(user_id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      account_type: user.account_type,
      address: user.address,
      additional_info: user.additional_info,
      name_exibition: user.name_exibition,
      phone: user.phone,
      phone_validated: user.phone_validated,
      photo: user.photo,
      cpf: user.cpf,
      cnpj: user.cnpj,
      rg: user.rg,
    };
  }
}
