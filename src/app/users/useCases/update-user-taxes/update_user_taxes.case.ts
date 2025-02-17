import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserTaxesCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    tax_frequency,
    user_id,
  }: {
    user_id: string;
    tax_frequency: `${number}d`;
  }): Promise<any> {
    const user = new User(await this.usersRepository.findById(user_id));

    user.tax_frequency = tax_frequency;

    await this.usersRepository.update(user);
  }
}
