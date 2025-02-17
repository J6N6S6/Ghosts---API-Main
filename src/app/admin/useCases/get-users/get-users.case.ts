import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/repositories';
import { GetAllUsersQueryDTO } from '../../dtos/GetAllUsersQueryDTO';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { Users } from '@/infra/database/entities/users.entity';

@Injectable()
export class GetUsersCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    page = 1,
    items_per_page = 10,
    search,
  }: GetAllUsersQueryDTO) {
    let where_query: FindOptionsWhere<Users>[] = [];

    if (search) {
      where_query = [
        { email: ILike(`%${search}%`) },
        { name: ILike(`%${search}%`) },
        { cpf: ILike(`%${search}%`) },
        { cnpj: ILike(`%${search}%`) },
        { phone: ILike(`%${search}%`) },
      ];
    } else {
      where_query = [{ account_type: 'USER' }];
    }

    const [users, total_items] = await this.usersRepository.findAndCount({
      skip: (page - 1) * items_per_page,
      take: items_per_page,
      where: where_query,
      select: [
        'id',
        'name',
        'email',
        'cpf',
        'cnpj',
        'rg',
        'account_type',
        'additional_info',
        'admin_approved',
        'documentValidated',
        'document_approved_by',
        'total_revenue',
        'blocked_access',
        'tax_config',
        'tax_frequency',
        'indicated_by',
        'address',
        'phone',
        'photo',
        'name_exibition',
        'preferences',
        'activity',
      ],
    });

    // Calcula o total de páginas
    const total_pages = Math.ceil(total_items / items_per_page);

    return {
      users: users,
      total_items: total_items,
      total_pages: total_pages,
      current_page: page,
    };
  }
}
