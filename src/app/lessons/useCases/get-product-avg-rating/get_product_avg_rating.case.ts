import { LessonRatingsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProductAvgRatingCase {
  constructor(
    private readonly lessonRatingsRepository: LessonRatingsRepository,
  ) {}

  async execute(product_id: string) {
    const queryBuilder = this.lessonRatingsRepository
      .query()
      .select([
        'lr.product_id',
        'AVG(lr.rating) as avgRatingByUser',
        'COUNT(lr.rating) as numberOfRatingsByUser',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(DISTINCT lr.user_id)', 'userCount')
          .from('lesson_ratings', 'lr')
          .where('lr.product_id = :product_id', { product_id })
          .groupBy('lr.product_id');
      }, 'userCount')
      .where('lr.product_id = :product_id', { product_id })
      .groupBy('lr.product_id');

    queryBuilder.cache(
      `get-product-avg-rating:${product_id}`,
      1000 * 60 * 30, // 30 minutes
    );

    const result = await queryBuilder.getRawOne();

    if (!result)
      return {
        product_id,
        avg_rating: 0,
        ratings: 0,
      };

    return {
      product_id: result.lr_product_id,
      avg_rating: Number(Number(result.avgratingbyuser).toFixed(2)),
      ratings: Number(result.userCount),
    };
  }
}
