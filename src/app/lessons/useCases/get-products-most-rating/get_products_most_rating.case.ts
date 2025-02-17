import { LessonRatingsRepository } from '@/domain/repositories';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { GetProductsMostRatingDTO } from './get_products_most_rating.dto';

@Injectable()
export class GetProductsMostRatingCase {
  constructor(
    private readonly lessonRatingsRepository: LessonRatingsRepository,
  ) {}

  async execute({
    limit,
    page,
    search,
    category_id,
  }: GetProductsMostRatingDTO) {
    const pagination = Pagination(page, limit);
    const queryBuilder = this.lessonRatingsRepository
      .query()
      .select([
        'lr.product_id',
        'AVG(lr.rating) as avgRatingByUser',
        'COUNT(lr.rating) as numberOfRatingsByUser',
        'AVG(AVG(lr.rating)) OVER (PARTITION BY lr.product_id) as avgRatingForProduct',
        'COUNT(lr.user_id) OVER (PARTITION BY lr.product_id) as numberOfUsersForProduct',
      ])
      .leftJoin('lr.product', 'product')
      .where('product.allow_marketplace = :allow_marketplace', {
        allow_marketplace: true,
      })
      .groupBy('lr.product_id, lr.user_id')
      .orderBy('avgRatingForProduct', 'DESC')
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
      `get-products-most-rating:${page}:${limit}:${search}:${category_id}`,
      1000 * 60 * 30, // 30 minutes
    );

    const result = await queryBuilder.getRawMany();

    const productsWithRatings = result.map((item) => ({
      product_id: item.lr_product_id,
      avg_rating: Number(Number(item.avgratingforproduct).toFixed(2)),
      ratings: Number(item.numberofusersforproduct),
    }));

    return productsWithRatings;
  }
}
