import { TaxesRepository } from '@/domain/repositories/taxes.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserTaxesCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly taxesRepository: TaxesRepository,
  ) {}

  async execute(user_id: string): Promise<any> {
    const user = await this.usersRepository.findById(user_id);
    const user_taxes = await this.taxesRepository.findById(user.tax_config);

    if (!user_taxes) {
      const default_taxes = await this.taxesRepository.findById('default');
      return {
        tax_frequency: user.tax_frequency,
        tax_selected: user.tax_config,
        taxes: {
          default: default_taxes,
        },
      };
    }

    return {
      tax_frequency: user.tax_frequency,
      tax_selected: user.tax_config,
      taxes: {
        default: user_taxes,
      },
    };
  }
}
