import {
  ProductsAffiliatesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { In, ILike } from 'typeorm';
import { ListAffiliationsDTO } from './list_affiliations.dto';

@Injectable()
export class ListAffiliationsCase {
  constructor(
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({
    user_id,
    products: products_id,
    page,
    limit,
    status,
    search,
  }: ListAffiliationsDTO) {
    const products = await this.productsRepository.findAll({
      where: [
        {
          id: products_id.length > 0 ? In(products_id) : undefined,
          owner_id: user_id,
        },
        {
          id: products_id.length > 0 ? In(products_id) : undefined,
          coproducers: {
            user_id,
            accepted: true,
          },
        },
      ],
      relations: ['coproducers'],
      select: ['id'],
    });

    if (!products) throw new ClientException('Produto não encontrado');

    const where: any = {
      product_id: In(products.map((product) => product.id)),
    };

    let where_final = [where];

    if (status) {
      if (status === 'active') {
        where_final = [{ ...where, status: 'ACCEPTED', blocked: false }];
      } else if (status === 'pending') {
        where_final = [{ ...where, status: 'PENDING' }];
      } else {
        where_final = [
          { ...where, status: 'REJECTED' },
          {
            ...where,
            status: 'ACCEPTED',
            blocked: true,
          },
        ];
      }
    }

    if (search) {
      where_final = [
        { ...where, user: { name: ILike(`%${search}%`) } },
        { ...where, user: { email: ILike(`%${search}%`) } },
      ];
    }

    const affiliations = await this.productsAffiliatesRepository.find({
      where: where_final,
      select: {
        user: {
          name: true,
          email: true,
          photo: true,
        },
        product: {
          title: true,
          affiliate_commission: true,
          affiliate_commission_orderbump: true,
        },
      },
      relations: ['user', 'product'],
      ...Pagination(page, limit),
    });

    const total_affiliations = await this.productsAffiliatesRepository.count({
      where,
    });

    return {
      page,
      total_pages: Math.ceil(total_affiliations / limit),
      total_items: total_affiliations,
      affiliations,
    };
  }
}
