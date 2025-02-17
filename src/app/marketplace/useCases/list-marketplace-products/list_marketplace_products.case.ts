import { LessonsService } from '@/app/lessons/services/lessons.service';
import { TransactionsService } from '@/app/transactions/services/transactions.service';
import { ProductsRepository } from '@/domain/repositories';
import { Products } from '@/infra/database/entities';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, In, ILike } from 'typeorm';
import { ListMarketplaceProductsDTO } from './list_marketplace_products.dto';

@Injectable()
export class ListMarketplaceProductsCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly transactionsService: TransactionsService,
    private readonly lessonsService: LessonsService,
  ) {}

  async execute({
    page,
    limit,
    category_id,
    order_by = 'MOST_SALES',
    search,
  }: ListMarketplaceProductsDTO) {
    page = Number(page) || 1;

    let productsRating = [];
    const query: FindManyOptions<Products> = {
      select: {
        id: true,
        title: true,
        image: true,
        category: {
          id: true,
          title: true,
        },
        links: {
          id: true,
          price: true,
          title: true,
          short_id: true,
          allow_affiliation: true,
        },
        affiliate_commission: true,
        allow_affiliate: true,
        createdAt: true,
      },
      where: {
        allow_marketplace: true,
      },
      order: {
        createdAt: order_by === 'MOST_RECENT' ? 'DESC' : undefined,
      },
      relations: ['category', 'marketplace_link', 'links', 'category'],
      ...Pagination(page, limit),
      cache: {
        id: `list-marketplace-products:${page}:${limit}:${category_id}:${order_by}:${search}`,
        milliseconds: 1000 * 60 * 30, // 30 minutes
      },
    };

    if (category_id) query.where['category_id'] = category_id;
    if (search) query.where['title'] = ILike(`%${search}%`);

    if (order_by === 'MOST_RATING') {
      productsRating = await this.lessonsService.getProductsMostRating({
        limit,
        page,
        search,
        category_id,
      });

      query['where'] = {
        ...query['where'],
        id: In(productsRating.map((item) => item.product_id)),
      };
    }

    if (order_by === 'MOST_SALES') {
      const products = await this.transactionsService.getProductsMostSales({
        limit,
        page,
        search,
        category_id,
      });

      query['where'] = {
        ...query['where'],
        id: In(products.map((item) => item.product_id)),
      };
    }

    const products = await this.productsRepository.findAll(query);
    const products_count = await this.productsRepository.count({
      where: query.where,
    });

    const productsFinal = await Promise.all(
      products.map(async (product) => {
        const existsAvg = productsRating.find(
          (item) => item.product_id === product.id,
        );

        let avg_rating = 0;
        let ratings = 0;

        if (existsAvg) {
          avg_rating = existsAvg.avg_rating;
          ratings = existsAvg.ratings;
        } else {
          const avg = await this.lessonsService.getProductAvgRating(product.id);
          avg_rating = avg.avg_rating;
          ratings = avg.ratings;
        }

        const final_product = { ...product, avg_rating, ratings };

        if (product.allow_affiliate) {
          const link_most_value = product.links
            .filter((l) => l.allow_affiliation)
            .sort((a, b) => b.price - a.price)
            .shift();

          if (link_most_value) {
            const comission =
              link_most_value.price * (product.affiliate_commission / 100);

            final_product['biggest_comission'] = comission;
            final_product['biggest_link_value'] = link_most_value.price;
          }
        }
        final_product.links = undefined; // remove links from response

        return final_product;
      }),
    );

    return {
      total_items: products_count,
      total_pages: Math.ceil(products_count / limit),
      current_page: page,
      products: productsFinal,
    };
  }
}
