import { ProductsRepository } from '@/domain/repositories';
import { AdminProductsControlDTO } from './admin_products_control.dto';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Products } from '@/infra/database/entities';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminProductsControlCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    search,
    status,
    page = 1,
    limit = 10,
  }: AdminProductsControlDTO) {
    let where: FindOptionsWhere<Products> | FindOptionsWhere<Products>[] = {
      status: status,
    };

    if (search) {
      const newWhere: FindOptionsWhere<Products>[] = [];
      newWhere.push({ ...where, title: ILike(`%${search}%`) });
      newWhere.push({
        ...where,
        owner: [
          { name: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
        ],
      });
      where = newWhere;
    }

    const pagination = Pagination(page, limit);

    const [products, total_items] = await this.productsRepository.findAndCount({
      where,
      ...pagination,
      relations: ['owner', 'preferences', 'links'],
      select: {
        owner: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          cnpj: true,
          documentStatus: true,
          phone_validated: true,
          email_validated: true,
        },
      },
    });

    return {
      products,
      total_items,
      page,
      total_pages: Math.ceil(total_items / limit),
    };
  }
}
