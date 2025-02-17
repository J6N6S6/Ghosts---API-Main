import { LessonsService } from '@/app/lessons/services/lessons.service';
import {
  ProductsAffiliatesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetMarketplaceProductDTO } from './get_marketplace_product.dto';

@Injectable()
export class GetMarketplaceProductCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly lessonsService: LessonsService,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute({ user_id, product_id }: GetMarketplaceProductDTO) {
    const product = await this.productsRepository.findOne({
      select: {
        id: true,
        title: true,
        description: true,
        marketplace_description: true,
        marketplace_link: {
          id: true,
          title: true,
          short_id: true,
        },
        marketplace_support_email: true,
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
        product_website: true,
        payment_type: true,
        producer_name: true,
        product_type: true,
        allow_marketplace: true,
      },
      where: [{ id: product_id }, { short_id: product_id }],
      relations: ['category', 'marketplace_link', 'links', 'category'],
      cache: {
        id: `get-marketplace-product:${product_id}`,
        milliseconds: 1000 * 60 * 30, // 30 minutes
      },
    });

    if (!product) throw new ClientException('Produto não encontrado');
    if (!product.allow_marketplace && !product.allow_affiliate)
      throw new ClientException('Produto não disponível no marketplace');

    const avg = await this.lessonsService.getProductAvgRating(product.id);
    const avg_rating = avg.avg_rating;
    const ratings = avg.ratings;

    const userHasAffiliation = await this.productsAffiliatesRepository.findOne({
      where: {
        user_id,
        product_id: product.id,
      },
    });

    const final_product = {
      ...product,
      avg_rating,
      ratings,
      userHasAffiliation: !!userHasAffiliation,
    };

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
  }
}
