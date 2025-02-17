import { AuthService } from '@/app/auth/services/auth.service';
import { BaseIpnTransaction } from '@/app/ipn/dtos/base_ipn_transaction';
import { Transaction } from '@/domain/models/transaction.model';
import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { UserBankingSecureReserveModel } from '@/domain/models/user_secure_reserve.model';

import {
  ProductsRepository,
  TransactionsBuyersRepository,
  TransactionsRepository,
  UserBankingTransactionsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { TransactionsBuyers } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addDays } from 'date-fns';
import * as dayjs from 'dayjs';
import { DeliveryProductsCase } from '../../delivery-products/delivery_products.case';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizedPaymentCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly transactionsBuyersRepository: TransactionsBuyersRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly userSecureReserveRepository: IEUserSecureReserveRepository,

    private readonly productsRepository: ProductsRepository,
    private readonly deliveryProducts: DeliveryProductsCase,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  private payment_methods = {
    PIX: 'Pix',
    CREDIT_CARD: 'Cartão de Crédito',
    BANK_SLIP: 'Boleto',
  };

  async execute({
    payment_data,
    transaction,
    skipNotification = false,
  }: BaseIpnTransaction) {
    transaction.status = 'AUTHORIZED';
    console.log('MUDANDNO STATUS DA TRANSACAO PARA AUTORIZADA');
    transaction.date_approved = new Date(payment_data.date_approved);
    transaction.transaction_details = {
      ...transaction.transaction_details,
      net_received_amount: payment_data.net_received_amount,
      overpaid_amount:
        payment_data.transaction_amount - payment_data.total_paid_amount,
      total_paid_amount: payment_data.total_paid_amount,
    };
    transaction.metadata = {
      ...transaction.metadata,
      delivery: true,
    };

    const spliteds = transaction.split_accounts.filter((a) => a.paid);

    const split_promises = transaction.split_accounts
      .filter((a) => !a.paid)
      .map(async (split) => {
        const currentBalance =
          await this.userBankingTransactionsRepository.getBalanceByUserId(
            split.account_id,
          );

        const currentReservedAmount =
          (await this.userSecureReserveRepository.getReservedAmountByUserId(
            split.account_id,
          )) || 0;

        console.log('SPLIT: ', {
          ...split,
          total_amount_reserved:
            currentReservedAmount + split.secure_reserve_value,
        });

        console.log('SUSPEITA: ', {
          old_total_amount_reserved: currentReservedAmount,
          total_amount_reserved:
            currentReservedAmount + split.secure_reserve_value,

          status: 'in_reserve',
          user_id: split.account_id,
          value: split.secure_reserve_value,
          transaction: transaction,
          original_transaction_id: transaction.id,
          operation_type: 'income',
        });

        const secure_reserve = new UserBankingSecureReserveModel({
          old_total_amount_reserved: currentReservedAmount,
          total_amount_reserved:
            currentReservedAmount + split.secure_reserve_value,

          status: 'in_reserve',
          user_id: split.account_id,
          value: split.secure_reserve_value || 0,
          transaction: transaction,
          original_transaction_id: transaction.id,
          operation_type: 'income',
        });

        const new_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: split.amount,
          old_balance: currentBalance,
          operation_type: 'income',
          transaction_type: 'sale',
          discounts: [
            {
              type: 'tax-sale',
              name: 'Taxa de recebimento',
              amount: split.amount_tax,
            },
            {
              type: 'secure-reserve',
              name: 'Taxa de segurança',
              amount: split.secure_reserve_value,
            },
          ],
          balance: currentBalance + split.amount - split.secure_reserve_value,
          reference_id: transaction.id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await this.userBankingTransactionsRepository.create(new_balance);

        await this.userSecureReserveRepository.create(secure_reserve);

        spliteds.push({
          ...split,
          account_transaction_id: new_balance.id,
          paid: true,
          amount_paid: split.amount,
        });
      });

    transaction.split_accounts = spliteds;

    await Promise.all([...split_promises]);
    await this.transactionsRepository.update(transaction);

    const transaction_buyer = await this.transactionsBuyersRepository.findById(
      transaction.buyer_id,
    );

    let user = await this.usersRepository.findByEmail(transaction_buyer.email);

    if (!user)
      user = await this.authService.preCreateUser({
        email: transaction_buyer.email,
        name: transaction_buyer.name,
        phone: transaction_buyer.phone ? String(transaction_buyer.phone) : null,
        [transaction_buyer.document.length === 11 ? 'cpf' : 'cnpj']:
          transaction_buyer.document,
      });

    const products = [
      transaction.product_id,
      ...transaction.additional_products.map((p) => p.product_id),
    ];

    const promises = products.map(async (product_id) => {
      const product = await this.productsRepository.findById(product_id);

      if (product && product.members_area === 'INTERNAL') {
        await this.deliveryProducts.execute({
          user_id: user.id,
          product_id,
          transaction_id: transaction.id,
        });
      }
    });

    await Promise.all([
      ...promises,
      this.transactionsRepository.update(transaction),
    ]);

    if (!skipNotification) {
      await this.sendNotifications({ transaction, transaction_buyer });
    }

    return {
      hasError: false,
      message: 'Transaction updated',
    };
  }

  async sendNotifications({
    transaction,
    transaction_buyer,
  }: {
    transaction: Transaction;
    transaction_buyer: TransactionsBuyers;
  }) {
    console.log('FUNCAO DE SEND NOTIFICATIONS');
    const [product, seller] = await Promise.all([
      this.productsRepository.findOne({
        where: { id: transaction.product_id },
        relations: ['content'],
      }),
      this.usersRepository.findById(transaction.seller_id),
    ]);

    const slit_producer = transaction.split_accounts.find(
      (a) => a.account_id === transaction.seller_id,
    );

    const IsSaleAfterOneDay = dayjs(transaction.date_approved)
      .add(1, 'day')
      .isAfter(dayjs());

    console.log('is sale after one day : ', IsSaleAfterOneDay);

    if (IsSaleAfterOneDay) {
      console.log('ENTROU NO IF IS SALE');
      let title = `Venda realizada (${
        this.payment_methods[transaction.payment_method]
      })`;

      if (transaction.payment_method === 'BANK_SLIP')
        title = `Venda confirmada (${
          this.payment_methods[transaction.payment_method]
        })`;

      console.log('SPLIT PRODUCER', slit_producer);
      this.eventEmitter.emit('push_notification.send', {
        user_id: transaction.seller_id,
        notification_type: 'MOBILE_APPROVED_SALES',
        notification: {
          title,
          body: `Sua comissão: ${slit_producer.amount.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          })}`,
          sound: 'cash.wav',
        },
      });
      console.log('ENVIANDO NOTIFICACAO DE VENDA REALIZADA');

      this.eventEmitter.emit('integrations.pushcut', {
        user_id: transaction.seller_id,
        notification_type: 'MOBILE_APPROVED_SALES',
      });

      this.eventEmitter.emit('integrations.utmfy', {
        user_id: transaction.seller_id,
        transactions: transaction,
      });

      this.eventEmitter.emit('notification.send', {
        user_id: transaction.seller_id,
        notification_type: null,
        body: `Venda realizada, sua comissão: **${slit_producer.amount.toLocaleString(
          'pt-br',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}**
            `,
        icon: 'success',
        action_data: {
          type: 'transaction',
          id: transaction.id,
        },
      });
    }

    if (seller.indicated_by) {
      const user = await this.usersRepository.findById(seller.indicated_by);

      if (user && IsSaleAfterOneDay) {
        const split_indication = transaction.split_accounts.find(
          (a) => a.account_id === seller.indicated_by,
        );

        this.eventEmitter.emit('notification.send', {
          user_id: user.id,
          notification_type: null,
          body: `Venda realizada, sua indicação **${
            seller.name
          }** realizou uma venda! Sua comissão: **${split_indication.amount.toLocaleString(
            'pt-br',
            {
              style: 'currency',

              currency: 'BRL',
            },
          )}**`,
          icon: 'success',
          action_data: {
            type: 'transaction',
            id: transaction.id,
          },
        });
      }
    }

    try {
      const mails_to_send = [];

      // send email to producer and co_producer to approve the sale
      for (const split of transaction.split_accounts) {
        if (
          split.account_type !== 'seller' &&
          split.account_type !== 'co_producer' &&
          split.account_type !== 'affiliate'
        )
          continue;

        // if (split.account_type === 'seller') continue;

        const seller = await this.usersRepository.findById(split.account_id);

        mails_to_send.push({
          to: {
            address: seller.email,
            name: seller.name,
          },
          template:
            split.account_type === 'seller'
              ? 'PRODUCER_APPROVED_SALE'
              : split.account_type === 'affiliate'
              ? 'AFFILIATE_APPROVED_SALE'
              : 'CO_PRODUCER_APPROVED_SALE',
          template_data: {
            [split.account_type === 'affiliate'
              ? 'affiliate_name'
              : 'producer_name']: seller.name,

            [split.account_type === 'affiliate'
              ? 'affiliate_comission'
              : 'producer_comission']: Number(
              split.amount_paid.toFixed(2),
            ).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
            product_name: product.title,
            product_value: Number(product.price.toFixed(2)).toLocaleString(
              'pt-br',
              {
                style: 'currency',
                currency: 'BRL',
              },
            ),
            transaction_code: transaction.id,
            buyer_name: transaction_buyer.name || 'Não informado',
            buyer_phone: transaction_buyer.phone || 'Não informado',
            buyer_email: transaction_buyer.email || 'Não informado',
            payment_date: transaction.date_approved.toLocaleDateString('pt-br'),
            payment_method: this.payment_methods[transaction.payment_method],
            product_description: transaction.product.description,
            product_image: transaction.product.image,
          },
        });
      }

      // send email to buyer
      mails_to_send.push({
        to: {
          address: transaction_buyer.email,
          name: transaction_buyer.name,
        },
        template: 'BUYER_APPROVED_SALE',
        template_type: null,
        template_data: {
          producer_name: product.producer_name,
          producer_email: product.support_email,
          product_image: product.image,
          product_url:
            product.members_area === 'EXTERNAL'
              ? `${this.configService.get('content_url')}?link=${
                  product.content.content
                }`
              : this.configService.get('members_url'),
          product_name: product.title,
          product_description: product.description,
          product_value: Number(
            transaction.transaction_amount.toFixed(2),
          ).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }),
          transaction_code: transaction.id,
          buyer_name: transaction_buyer.name || 'Não informado',
          payment_date: transaction.date_approved.toLocaleDateString('pt-br'),
          payment_method: this.payment_methods[transaction.payment_method],
        },
        templateId: 'd-1d9c8b660e7240b58c88b9d40344850f',
        subject: 'Compra aprovada',
      });

      if (IsSaleAfterOneDay)
        await Promise.all(
          mails_to_send.map((mail) =>
            this.eventEmitter.emit('mailer.send', mail),
          ),
        );
    } catch (err) {
      // this.console.error(err);
    }
  }
}
