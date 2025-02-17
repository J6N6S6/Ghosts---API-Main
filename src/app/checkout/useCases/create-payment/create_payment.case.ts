import { TransactionBuyer } from '@/domain/models/transaction_buyer.model';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { TaxesRepository } from '@/domain/repositories/taxes.repository';
import { TransactionsBuyersRepository } from '@/domain/repositories/transactions_buyers.repository';
import { Injectable } from '@nestjs/common';
import { ICreatePaymentDTO } from './create_payment.dto';

import { PaymentService } from '@/app/gateways/services/payment.service';
import { ProductsAffiliatesRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { add } from '@/shared/utils/add';
import { convertNumber } from '@/shared/utils/convertNumber';
import { ExecutePaymentCase } from './execute_payment.case';
import { GetPaymentFee } from './utils/getPaymentFee';
import { validateProduct } from './validations/product.validation';

@Injectable()
export class CreatePaymentCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
    private readonly transactionsBuyersRepository: TransactionsBuyersRepository,
    private readonly paymentService: PaymentService,
    private readonly coProducersRepository: CoProducersRepository,
    private readonly taxesRepository: TaxesRepository,

    private readonly executePaymentCase: ExecutePaymentCase,
  ) {}

  async execute({
    product_link,
    card_data = [],
    payer,
    payment_method,
    product_value,
    additional_products = [],
    use_two_cards = false,
    affiliate_id,
    requester,
  }: ICreatePaymentDTO): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: [
        { short_id: product_link },
        {
          links: {
            short_id: product_link,
            status: 'active',
          },
        },
      ],
      relations: ['owner', 'owner.user_indicated', 'links'],
    });

    if (!product) throw new ClientException('Produto não encontrado');
    const link =
      product.short_id !== product_link
        ? product.links.find((item) => item.short_id === product_link)
        : null;

    await validateProduct({
      product,
      product_value,
      link,
      payment_method,
      card_data,
    });

    const [product_preferences, affiliate] = await Promise.all([
      this.productsPreferencesRepository.findByProductId(product.id),
      affiliate_id
        ? this.productsAffiliatesRepository.findOne({
            where: { id: affiliate_id },
            relations: ['user'],
          })
        : null,
    ]);

    const new_buyer = new TransactionBuyer({
      payment_method,
      product_id: product.id,
      name: payer.name,
      document: payer.document,
      email: payer.email.toLowerCase(),
      birth_date: payer.birth_date,
      phone: payer.phone,
      address: payer.address || {},
      utm_campaign: payer.utm?.campaign,
      utm_content: payer.utm?.content,
      utm_medium: payer.utm?.medium,
      utm_source: payer.utm?.source,
      utm_term: payer.utm?.term,
    });

    const buyer = await this.transactionsBuyersRepository.create(new_buyer);

    // Validacoes do checkout

    if (additional_products) {
      const links = product_preferences.orderbumps
        .filter((i) =>
          additional_products
            .map((item) => item.product_id)
            .includes(i.bump_id),
        )
        .map((item) => {
          return {
            product_id: item.bump_id,
            product_link: item.product_link,
          };
        });

      if (links.length !== additional_products.length)
        throw new ClientException('Produto adicional não encontrado');

      const products = await this.productsLinksRepository.findByIds(
        links.map((item) => item.product_link),
      );

      for (const product of products) {
        const item = additional_products.find(
          (item) => item.product_id === product.id,
        );

        if (item.product_value !== product.price)
          throw new ClientException('Valor do produto adicional inválido');
      }
    }

    // Calculando valores e splits

    const taxes = await this.taxesRepository.findAll();

    const product_price = convertNumber(link ? link.price : product.price);

    const total_bumps_value =
      additional_products?.reduce(
        (acc, item) => add(acc, item.product_value),
        0,
      ) || 0;
    const total_value = convertNumber(product_price + total_bumps_value);

    const splits = [];

    const co_producers = await this.coProducersRepository.find({
      where: { accepted: true, product_id: product.id },
      relations: ['user'],
    });

    if (co_producers.length > 0) {
      for (const co_producer of co_producers) {
        const tax = taxes.find(
          (item) => item.id === co_producer.user.tax_config,
        );

        const payment_fee = GetPaymentFee({
          payment_method,
          tax,
          tax_frequency: co_producer.user.tax_frequency,
        });

        const days_to_receive =
          co_producer.user.tax_frequency.slice(-1) === 'd'
            ? parseInt(co_producer.user.tax_frequency.slice(0, -1))
            : 30;

        splits.push({
          type: 'CO_PRODUCER',
          user_id: co_producer.user.id,
          commission: co_producer.commission,
          commissionOrderBump: co_producer.commission_orderbump,
          tax: {
            fixed_amount: payment_fee.fixed_amount,
            percentage: payment_fee.percentage,
          },
          days_to_receive:
            payment_method !== 'CREDIT_CARD' ? 0 : days_to_receive,
        });
      }
    }

    if (affiliate && product.allow_affiliate) {
      const tax = taxes.find((item) => item.id === affiliate.user.tax_config);

      const payment_fee = GetPaymentFee({
        payment_method,
        tax,
        tax_frequency: affiliate.user.tax_frequency,
      });

      const days_to_receive =
        affiliate.user.tax_frequency.slice(-1) === 'd'
          ? parseInt(affiliate.user.tax_frequency.slice(0, -1))
          : 30;

      splits.push({
        type: 'AFFILIATE',
        user_id: affiliate.user.id,
        commission: product.affiliate_commission,
        commissionOrderBump: product.affiliate_commission_orderbump,
        tax: {
          fixed_amount: payment_fee.fixed_amount,
          percentage: payment_fee.percentage,
        },
        days_to_receive: payment_method !== 'CREDIT_CARD' ? 0 : days_to_receive,
      });
    }

    if (product.owner.user_indicated) {
      const days_to_receive =
        product.owner.user_indicated.tax_frequency.slice(-1) === 'd'
          ? parseInt(product.owner.user_indicated.tax_frequency.slice(0, -1))
          : 30;

      splits.push({
        type: 'INDICATED',
        user_id: product.owner.user_indicated.id,
        commission: 1,
        commissionOrderBump: 1,
        tax: {
          fixed_amount: 0,
          percentage: 0,
        },
        days_to_receive: payment_method !== 'CREDIT_CARD' ? 0 : days_to_receive,
      });
    }

    const payment_fee = GetPaymentFee({
      payment_method,
      tax: taxes.find((item) => item.id === product.owner.tax_config),
      tax_frequency: product.owner.tax_frequency,
    });

    const secure_reserve_fee = {
      percentage: 10,
    };

    const transaction_data = this.paymentService.calculateTransactionSplits({
      total_value,
      use_two_cards,
      cards: card_data.map((card) => ({
        card_installment: card.installment,
        amount: card.amount,
      })),
      splits,
      tax_producer: payment_fee,
      additional_products: additional_products || [],
      secure_reserve_fee,
    });

    // Criando transacao

    const transaction = await this.executePaymentCase.execute({
      transaction_data,
      product,
      buyer,
      card_data: payment_method === 'CREDIT_CARD' ? card_data : [],
      payment_method,
      product_link,
      product_price,
      total_value,
      additional_products: additional_products.map((item) => ({
        product_id: item.product_id,
        unit_price: item.product_value,
      })),
      requester: requester,
    });

    return transaction;
  }
}
