import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';

import { Transaction } from '@/domain/models/transaction.model';
import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { ProductsAffiliatesRepository } from '@/domain/repositories';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ServerException } from '@/infra/exception/server.exception';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { addDays } from 'date-fns';
import { RemoveProductsCase } from '../remove-products/remove_products.case';
import { AuthorizedPaymentCase } from './useCases/authorized_payment.case';
import { InDisputePaymentCase } from './useCases/in_dispute_payment.case';
import { RefundedPaymentCase } from './useCases/refunded_payment.case copy';

const payment_methods = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de Crédito',
  BANK_SLIP: 'Boleto',
};

interface ITransaction {
  payment_data: GetStatusPayment;
  transaction: Transaction;
  status?: string;
}

@Injectable()
export class CreateTransactionIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
    private readonly removeProducts: RemoveProductsCase,
    private readonly eventEmitter: EventEmitter2,

    private readonly authorizedPaymentCase: AuthorizedPaymentCase,
    private readonly inDisputePaymentCase: InDisputePaymentCase,
    private readonly refundedPaymentCase: RefundedPaymentCase,
  ) {}

  private readonly console = new ConsoleLogger('IpnService');

  async execute({ payment_data, transaction, status }: ITransaction) {
    const transactionSchema = {
      payment_data,
      transaction,
    };

    if (transaction.forced_status) return;

    switch (status) {
      case 'PENDING':
      case 'WAITING_PAYMENT':
      case 'IN_PROCESS':
        return await this.pendingPayment(transactionSchema);
      case 'APPROVED':
      case 'AUTHORIZED':
        return await this.authorizedPaymentCase.execute(transactionSchema);
      case 'REFUNDED':
        return await this.refundedPaymentCase.execute(transactionSchema);

      case 'CANCELLED':
        return await this.canceledPayment(transactionSchema);
      case 'REJECTED':
        return await this.rejectedPayment(transactionSchema);
      case 'CHARGED_BACK':
      case 'CHARGEBACK':
        return await this.chargebackPayment(transactionSchema);
      case 'IN_MEDIATION':
        return await this.disputePayment(transactionSchema);
      case 'IN_DISPUTE':
        return await this.inDisputePaymentCase.execute(transactionSchema);
      default:
        throw new ServerException('Status não suportado', {
          payment_data,
          transaction,
          status,
        });
    }
  }

  @OnEvent('transaction.pending')
  async pendingPayment({ transaction }: ITransaction) {
    transaction.status = 'PENDING';

    if (transaction.payment_method !== 'CREDIT_CARD') {
      this.eventEmitter.emit('push_notification.send', {
        user_id: transaction.seller_id,
        notification_type: 'MOBILE_GENERATED_PIX_AND_BANK_SLIP',
        notification: {
          title: `Venda pendente (${
            payment_methods[transaction.payment_method]
          })`,
          body: `Sua comissão: ${transaction.split_accounts
            .find((a) => a.account_id === transaction.seller_id)
            .amount.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })}`,
          sound: 'cash.wav',
        },
      });

      this.eventEmitter.emit('integrations.pushcut', {
        user_id: transaction.seller_id,
        notification_type: 'MOBILE_GENERATED_PIX_AND_BANK_SLIP',
      });

      this.eventEmitter.emit('integrations.utmfy', {
        user_id: transaction.seller_id,
        transaction: transaction,
      });

      if (transaction.split_accounts.length > 1) {
        transaction.split_accounts.map((item) => {
          if (item.account_type === 'seller') {
            return;
          }

          this.eventEmitter.emit('push_notification.send', {
            user_id: item.account_id,
            notification_type: 'MOBILE_GENERATED_PIX_AND_BANK_SLIP',
            notification: {
              title: `Venda pendente (${
                payment_methods[transaction.payment_method]
              })`,
              body: `Sua comissão: ${item.amount.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              })}`,
              sound: 'cash.wav',
            },
          });

          this.eventEmitter.emit('integrations.pushcut', {
            user_id: item.account_id,
            notification_type: 'MOBILE_GENERATED_PIX_AND_BANK_SLIP',
          });

          this.eventEmitter.emit('integrations.utmfy', {
            user_id: item.account_id,
            transaction: transaction,
          });
        });
      }
    }

    await this.transactionsRepository.update(transaction);

    // send email to buyer
    try {
      if (transaction.payment_method !== 'CREDIT_CARD')
        this.eventEmitter.emit('mailer.send', {
          to: {
            address: transaction.buyer.email,
            name: transaction.buyer.name,
          },
          template:
            transaction.payment_method === 'BANK_SLIP'
              ? 'BUYER_PENDING_BANK_SLIP_SALE'
              : 'BUYER_PENDING_PIX_SALE',
          template_data: {
            product_name: transaction.product.title,
            product_value: Number(
              transaction.transaction_amount.toFixed(2),
            ).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
            producer_name: transaction.product.producer_name,
            producer_email: transaction.product.support_email,
            product_link: transaction.product_link,
            product_description: transaction.product.description,
            product_image: transaction.product.image,
            transaction_code: transaction.id,
            buyer_name: transaction.buyer.name || 'Não informado',
            payment_date: transaction.date_created.toLocaleDateString('pt-br'),
            payment_method: payment_methods[transaction.payment_method],
          },
          subject: `Finalize a compra do seu produto - ${transaction.product.title}`,
          templateId: 'd-ea0f9179573443ddb1cd4461d914ffc1',
        });
    } catch (err) {
      this.console.error(err);
    }
  }

  async processingPayment({ payment_data, transaction }: ITransaction) {
    transaction.status = 'PROCESSING';
    transaction.date_approved = new Date(payment_data.date_approved);
    await this.transactionsRepository.update(transaction);
  }

  async canceledPayment({ transaction }: ITransaction) {
    transaction.status = 'CANCELED';

    await this.transactionsRepository.update(transaction);
  }

  async rejectedPayment({ transaction }: ITransaction) {
    transaction.status = 'REJECTED';

    await this.transactionsRepository.update(transaction);
  }

  async disputePayment({ transaction }: ITransaction) {
    transaction.status = 'IN_DISPUTE';
    transaction.transaction_details = {
      ...transaction.transaction_details,
      net_received_amount:
        transaction?.transaction_details.net_received_amount * -1 || 0,
      total_paid_amount: 0,
    };

    await this.removeProducts.execute({
      transaction_id: transaction.id,
    });

    transaction.metadata = {
      ...transaction.metadata,
      refund_date: new Date(),
      delivery: false,
    };

    const spliteds = [];

    const split_promises = transaction.split_accounts.map(async (split) => {
      let balance =
        await this.userBankingTransactionsRepository.getBalanceByUserId(
          split.account_id,
        );

      let penality_fee = split.penality || 0;

      if (penality_fee === 0) {
        const penality_value = split.amount * 0.1;

        const penality_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: penality_value,
          old_balance: balance,
          operation_type: 'expense',
          transaction_type: 'penality',
          discounts: [],
          balance: balance - penality_value,
          reference_id: transaction.id,
          original_transaction_id: split.account_transaction_id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await this.userBankingTransactionsRepository.create(penality_balance);

        penality_fee = penality_value;
        balance = penality_balance.balance;
      }

      let chargeback_id = null;

      if (split.paid) {
        const chargeback_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: split.amount,
          old_balance: balance,
          operation_type: 'expense',
          transaction_type: 'chargeback',
          discounts: [
            {
              type: 'tax-sale',
              name: 'Cancelamento da Taxa de recebimento',
              amount: split.amount_tax,
            },
          ],
          balance: balance - split.amount,
          reference_id: transaction.id,
          original_transaction_id: split.account_transaction_id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await this.userBankingTransactionsRepository.create(chargeback_balance);

        chargeback_id = chargeback_balance.id;
      }

      spliteds.push({
        ...split,
        account_transaction_id: chargeback_id
          ? chargeback_id
          : split.account_transaction_id,
        paid: chargeback_id ? false : split.paid,
        amount_paid: chargeback_id ? 0 : split.amount,
        amount_refunded: chargeback_id ? split.amount : 0,
        penality: penality_fee,
      });
    });

    transaction.split_accounts = spliteds;

    await Promise.all(split_promises);

    await this.transactionsRepository.update(transaction);

    // send mails

    const mails_to_send = [];

    try {
      for (const split of transaction.split_accounts) {
        if (
          split.account_type !== 'seller' &&
          split.account_type !== 'co_producer'
        )
          continue;

        const seller = await this.usersRepository.findById(split.account_id);

        mails_to_send.push({
          to: {
            address: seller.email,
            name: seller.name,
          },
          template:
            split.account_type === 'seller'
              ? 'PRODUCER_DISPUTE_SALE'
              : 'CO_PRODUCER_DISPUTE_SALE',
          template_data: {
            producer_name: seller.name,

            product_name: transaction.product.title,
            product_value: Number(
              transaction.transaction_amount.toFixed(2),
            ).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
            transaction_code: transaction.id,
            buyer_name: transaction.buyer.name || 'Não informado',
            buyer_phone: transaction.buyer.phone || 'Não informado',
            buyer_email: transaction.buyer.email || 'Não informado',
            payment_date: (
              transaction.date_approved || transaction.date_created
            ).toLocaleDateString('pt-br'),
            payment_method: payment_methods[transaction.payment_method],
            product_image: transaction.product.image,
            product_description: transaction.product.description,
          },
        });
      }

      // send email to buyer

      mails_to_send.push({
        to: {
          address: transaction.buyer.email,
          name: transaction.buyer.name,
        },
        template: 'BUYER_DISPUTE_SALE',
        template_data: {
          producer_name: transaction.product.producer_name,
          producer_email: transaction.product.support_email,

          product_name: transaction.product.title,
          product_value: Number(
            transaction.transaction_amount.toFixed(2),
          ).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }),
          product_description: transaction.product.description,
          product_image: transaction.product.image,
          transaction_code: transaction.id,
          buyer_name: transaction.buyer.name || 'Não informado',
          payment_date: (
            transaction.date_approved || transaction.date_created
          ).toLocaleDateString('pt-br'),
          payment_method: payment_methods[transaction.payment_method],
        },
      });

      await Promise.all(
        mails_to_send.map((mail) =>
          this.eventEmitter.emit('mailer.send', mail),
        ),
      );
    } catch (error) {
      this.console.error(error);
    }
  }

  async chargebackPayment({ transaction }: ITransaction) {
    transaction.status = 'CHARGEBACK';
    transaction.transaction_details = {
      ...transaction.transaction_details,
      net_received_amount:
        transaction?.transaction_details.net_received_amount * -1 || 0,
      total_paid_amount: 0,
    };

    await this.removeProducts.execute({
      transaction_id: transaction.id,
    });

    transaction.metadata = {
      ...transaction.metadata,
      refund_date: new Date(),
      delivery: false,
    };

    const spliteds = [];

    const split_promises = transaction.split_accounts.map(async (split) => {
      let balance =
        await this.userBankingTransactionsRepository.getBalanceByUserId(
          split.account_id,
        );

      let penality_fee = split.penality || 0;

      if (penality_fee === 0) {
        const penality_value = split.amount * 0.1;

        const penality_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: penality_value,
          old_balance: balance,
          operation_type: 'expense',
          transaction_type: 'penality',
          discounts: [],
          balance: balance - penality_value,
          reference_id: transaction.id,
          original_transaction_id: split.account_transaction_id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await this.userBankingTransactionsRepository.create(penality_balance);

        penality_fee = penality_value;
        balance = penality_balance.balance;
      }

      let chargeback_id = null;

      if (split.paid) {
        const chargeback_balance = new UserBankingTransaction({
          user_id: split.account_id,
          value: split.amount,
          old_balance: balance,
          operation_type: 'expense',
          transaction_type: 'chargeback',
          discounts: [
            {
              type: 'tax-sale',
              name: 'Cancelamento da Taxa de recebimento',
              amount: split.amount_tax,
            },
          ],
          balance: balance - split.amount,
          reference_id: transaction.id,
          original_transaction_id: split.account_transaction_id,
          liquidation_date: addDays(new Date(), split.days_to_receive),
        });

        await this.userBankingTransactionsRepository.create(chargeback_balance);

        chargeback_id = chargeback_balance.id;
      }

      spliteds.push({
        ...split,
        account_transaction_id: chargeback_id
          ? chargeback_id
          : split.account_transaction_id,
        paid: chargeback_id ? false : split.paid,
        amount_paid: chargeback_id ? 0 : split.amount,
        amount_refunded: chargeback_id ? split.amount : 0,
        penality: penality_fee,
      });
    });

    transaction.split_accounts = spliteds;

    await Promise.all(split_promises);

    await this.transactionsRepository.update(transaction);

    // send mails

    const mails_to_send = [];

    try {
      for (const split of transaction.split_accounts) {
        if (
          split.account_type !== 'seller' &&
          split.account_type !== 'co_producer' &&
          split.account_type !== 'affiliate'
        )
          continue;

        const seller = await this.usersRepository.findById(split.account_id);

        mails_to_send.push({
          to: {
            address: seller.email,
            name: seller.name,
          },
          template:
            split.account_type === 'seller'
              ? 'PRODUCER_CHARGEBACK_SALE'
              : split.account_type === 'affiliate'
              ? 'AFFILIATE_CHARGEBACK_SALE'
              : 'CO_PRODUCER_CHARGEBACK_SALE',
          template_data: {
            [split.account_type === 'affiliate'
              ? 'affiliate_name'
              : 'producer_name']: seller.name,

            product_name: transaction.product.title,
            product_value: Number(
              transaction.transaction_amount.toFixed(2),
            ).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
            transaction_code: transaction.id,
            buyer_name: transaction.buyer.name || 'Não informado',
            buyer_phone: transaction.buyer.phone || 'Não informado',
            buyer_email: transaction.buyer.email || 'Não informado',
            payment_date: (
              transaction.date_approved || transaction.date_created
            ).toLocaleDateString('pt-br'),
            payment_method: payment_methods[transaction.payment_method],
            product_image: transaction.product.image,
            product_description: transaction.product.description,
          },
        });
      }

      if (transaction.buyer.affiliate_id) {
        const affiliate = await this.productsAffiliatesRepository.findOne({
          where: {
            user_id: transaction.buyer.affiliate_id,
          },
          relations: ['user'],
        });

        if (affiliate)
          mails_to_send.push({
            to: {
              address: affiliate.user.email,
              name: affiliate.user.name,
            },
            template: 'AFFILIATE_CHARGEBACK_SALE',
            template_data: {
              affiliate_name: affiliate.user.name,
              product_name: transaction.product.title,
              product_value: Number(
                transaction.transaction_amount.toFixed(2),
              ).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              }),
              product_description: transaction.product.description,
              product_image: transaction.product.image,
              transaction_code: transaction.id,
              buyer_name: transaction.buyer.name || 'Não informado',
              buyer_phone: transaction.buyer.phone || 'Não informado',
              buyer_email: transaction.buyer.email || 'Não informado',
              payment_date: (
                transaction.date_approved || transaction.date_created
              ).toLocaleDateString('pt-br'),
              payment_method: payment_methods[transaction.payment_method],
            },
          });
      }

      // send email to buyer

      mails_to_send.push({
        to: {
          address: transaction.buyer.email,
          name: transaction.buyer.name,
        },
        template: 'BUYER_REFUND_SALE',
        template_data: {
          producer_name: transaction.product.producer_name,
          producer_email: transaction.product.support_email,
          product_description: transaction.product.description,
          product_image: transaction.product.image,
          product_name: transaction.product.title,
          product_value: Number(
            transaction.transaction_amount.toFixed(2),
          ).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }),
          transaction_code: transaction.id,
          buyer_name: transaction.buyer.name || 'Não informado',
          payment_date: (
            transaction.date_approved || transaction.date_created
          ).toLocaleDateString('pt-br'),
          payment_method: payment_methods[transaction.payment_method],
        },
      });

      await Promise.all(
        mails_to_send.map((mail) =>
          this.eventEmitter.emit('mailer.send', mail),
        ),
      );
    } catch (error) {
      this.console.error(error);
    }
  }
}
