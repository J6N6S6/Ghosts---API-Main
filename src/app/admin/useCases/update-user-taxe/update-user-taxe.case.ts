import { Injectable } from '@nestjs/common';
import {
  PlataformSettingsRepository,
  TaxesRepository,
  UsersRepository,
} from '@/domain/repositories';
import { Tax } from '@/domain/models/tax.model';
import { GetAllUsersQueryDTO } from '../../dtos/GetAllUsersQueryDTO';
import { UpdateUserTaxeDTO } from '../../dtos/UpdateUserTaxeDTO';
import { ClientException } from '@/infra/exception/client.exception';
import { User } from '@/domain/models/users.model';

@Injectable()
export class UpdateUserTaxeCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly taxesRepository: TaxesRepository
  ) {}

  async execute({ taxe, userId }: UpdateUserTaxeDTO) {
    const taxeExists = await this.taxesRepository.findById(taxe);

    if (!taxeExists) {
      throw new ClientException('Taxe not found');
    }

    const user = await this.usersRepository.findById(userId);
    user.tax_config = taxeExists.id;

    const updatedUser = new User(user);
    await this.usersRepository.update(updatedUser);

    return 'User taxe updated sucessfully';
  }
}
