import { TransactionsRepository } from '@/domain/repositories';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { GetProductsMostSalesDTO } from './get_products_most_sales.dto';

@Injectable()
export class GetProductsMostSalesCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute({ limit, page, search, category_id }: GetProductsMostSalesDTO) {
    const pagination = Pagination(page, limit);

    const queryBuilder = this.transactionsRepository
      .queryBuilder()
      .select(['t.product_id', 'COUNT(t.id) as totalSales'])
      .where('t.status = :status', { status: 'AUTHORIZED' })
      .groupBy('t.product_id')
      .leftJoin('t.product', 'product')
      .andWhere('product.allow_marketplace = :allow_marketplace', {
        allow_marketplace: true,
      })
      .orderBy('totalSales', 'DESC')
      .skip(pagination.skip)
      .take(pagination.take);

    if (search) {
      queryBuilder.andWhere('product.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', {
        category_id,
      });
    }

    queryBuilder.cache(
      `get-products-most-sales:${page}:${limit}:${search}:${category_id}`,
      1000 * 60 * 30, // 30 minutes
    );

    const result = await queryBuilder.getRawMany();

    const productsWithSales = result.map((item) => ({
      product_id: item.t_product_id,
      sales: item.totalSales,
    }));

    return productsWithSales;
  }
}
