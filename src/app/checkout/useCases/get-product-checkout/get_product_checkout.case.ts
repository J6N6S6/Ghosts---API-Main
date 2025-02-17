import { ClientException } from '@/infra/exception/client.exception';
import {
  PlataformSettingsRepository,
  ProductsAffiliatesRepository,
} from '@/domain/repositories';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { Products } from '@/infra/database/entities/products.entity';
import { ProductsPixel } from '@/infra/database/entities/products_pixels.entity';
import { Injectable } from '@nestjs/common';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { IsNull } from 'typeorm';

export interface ProductCheckout extends Products {
  is_link: boolean;
  link_id: string | null;
  pixels: ProductsPixel[];
  use_spf: boolean;
}

@Injectable()
export class GetProductCheckoutCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
    private readonly productsPixelRepository: ProductsPixelRepository,
    private readonly plataformSettingsRepository: PlataformSettingsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute(
    short_id: string,
    affiliate_id?: string,
  ): Promise<ProductCheckout> {
    let product_checkout = {
      product_id: '',
      price: 0,
    };

    if (short_id.length < 8) {
      const product_data = await this.productsRepository.findOne({
        where: {
          short_id,
        },
        select: {
          id: true,
          price: true,
        },
      });

      if (!product_data) {
        throw new ClientException('Produto não encontrado');
      }

      product_checkout = {
        product_id: product_data.id,
        price: product_data.price,
      };
    } else {
      const product_link_data = await this.productsLinksRepository.findOne({
        where: {
          short_id,
        },
        select: {
          product_id: true,
          price: true,
          status: true,
        },
      });

      if (!product_link_data) {
        throw new ClientException('Produto não encontrado');
      }

      if (product_link_data.status !== 'active') {
        throw new ClientException('Esse link não está mais disponível');
      }

      product_checkout = {
        product_id: product_link_data.product_id,
        price: product_link_data.price,
      };
    }

    const product = await this.getProduct(product_checkout.product_id);

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    console.log(product.status);

    if (product.status !== 'APPROVED') {
      throw new ClientException('Esse produto não está disponivel.', 404);
    }

    await Promise.all([
      ...product.preferences.orderbumps.map(async (orderbump) => {
        const orderbump_link = await this.productsLinksRepository.findByShortId(
          orderbump.product_link,
        );

        const orderbump_product = await this.productsRepository.findOne({
          where: {
            id: orderbump.bump_id,
          },
          select: {
            id: true,
            price: true,
            title: true,
          },
        });

        if (orderbump_link && orderbump_product) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          orderbump.price = orderbump_link.price;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          orderbump.original_price = orderbump_link.price * 2;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          orderbump.title = orderbump_product.title;
        }

        return orderbump;
      }),
    ]);

    const gateway = await this.plataformSettingsRepository.findByKey(
      'GATEWAY_CREDIT_CARD',
    );
    const defaultGateway = gateway?.value;

    const product_affiliate = await this.productsAffiliatesRepository.findOne({
      where: {
        product_id: product.id,
        id: affiliate_id,
        blocked: false,
        status: 'ACCEPTED',
      },
      select: ['id', 'user_id'],
    });

    const pixels = await this.productsPixelRepository.find({
      where: product_affiliate
        ? {
            product_id: product.id,
            user_id: product_affiliate.user_id,
            active: true,
          }
        : [
            {
              product_id: product.id,
              user_id: product.owner_id,
              active: true,
            },
            {
              product_id: product.id,
              user_id: IsNull(),
              active: true,
            },
          ],
      select: {
        id: true,
        content: true,
        domain: true,
        type: true,
        purchase_event_bank_slip: true,
        purchase_event_pix: true,
        token: true,
      },
    });

    const pixelsFiltered = pixels.map((pixel) => {
      return {
        ...pixel,
        token: undefined,
        server_event: !!pixel.token, // se tiver token, usar server event
      };
    });

    const useSecurePaymentForm =
      (product.gateway || defaultGateway) === GatewayProvider.MERCADO_PAGO;

    const { status, ...product_response } = product;

    return {
      ...product_response,
      price: product_checkout.price,
      is_link: short_id.length > 7,
      link_id: short_id.length > 7 ? short_id : null,
      pixels: pixelsFiltered,
      use_spf: useSecurePaymentForm,
    };
  }

  async getProduct(product_id: string): Promise<Products> {
    return this.productsRepository.findOne({
      where: {
        id: product_id,
      },
      select: {
        id: true,
        image: true,
        title: true,
        description: true,
        currency: true,
        sale_disabled: true,
        producer_name: true,
        support_email: true,
        support_phone: true,
        price: true,
        primary_banner: true,
        secondary_banner: true,
        allow_affiliate: true,
        affiliate_assignment: true,
        status: true,
      },
      relations: ['preferences'],
    });
  }
}
