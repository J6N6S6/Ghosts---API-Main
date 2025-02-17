import { Transaction } from '@/domain/models/transaction.model';
import { TransactionBuyer } from '@/domain/models/transaction_buyer.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { TransactionsBuyersRepository } from '@/domain/repositories/transactions_buyers.repository';
import { Injectable } from '@nestjs/common';

import { generatePaymentId } from '../../utils/generatePaymentId';
import { ExecuteBankSlipPaymentCase } from './cases/execute_bank_slip_payment.case';
import { ExecuteCreditCardPaymentCase } from './cases/execute_credit_card_payment.case';
import { ExecutePaymentDTO } from './cases/execute_payment.dto';
import { ExecutePixPaymentCase } from './cases/execute_pix_payment.case';
import { IExecutePaymentDTO } from './execute_payment.dto';
import { getDaysFromTaxFrequency } from './utils/getDaysFromTaxFrequency';

@Injectable()
export class ExecutePaymentCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly transactionsBuyersRepository: TransactionsBuyersRepository,
    private readonly executeBankSlipPaymentCase: ExecuteBankSlipPaymentCase,
    private readonly executeCreditCardPaymentCase: ExecuteCreditCardPaymentCase,
    private readonly executePixPaymentCase: ExecutePixPaymentCase,
  ) {}

  async execute({
    product,
    product_link,
    transaction_data,
    payment_method,
    buyer,
    additional_products,
    card_data,
    product_price,
    total_value,
    requester,
  }: IExecutePaymentDTO): Promise<any> {
    let payment_id = generatePaymentId();
    let payment_id_valid = false;

    while (!payment_id_valid) {
      const payment_id_exists = await this.transactionsRepository.findById(
        payment_id,
      );

      if (!payment_id_exists) payment_id_valid = true;

      if (!payment_id_valid) payment_id = generatePaymentId();
    }

    const transaction_schema = new Transaction({
      id: payment_id,
      payment_method,
      product_id: product.id,
      product_link: product_link || null,
      seller_id: product.owner.id,
      status: 'PENDING',
      transaction_amount: transaction_data.total_transaction_value,
      additional_products: additional_products,
      buyer_id: buyer.id,
      card: card_data.map((item) =>
        item.card_token
          ? {
              date_created: new Date().toISOString(),
              date_last_updated: new Date().toISOString(),
              external_transaction_id: '',
              individual_installments: item.installment,
              individual_amount: item.amount,
              total_paid_amount: 0,
              card_token: item.card_token,
            }
          : {
              last_four_digits: item.card_number.slice(-4),
              first_six_digits: item.card_number.slice(0, 6),
              expiration_month: parseInt(
                item.card_expiration_date.split('/')[0],
              ),
              expiration_year: parseInt(
                item.card_expiration_date.split('/')[1],
              ),
              holder_name: item.card_holder_name,

              date_created: new Date().toISOString(),
              date_last_updated: new Date().toISOString(),
              external_transaction_id: '',
              individual_installments: item.installment,
              individual_amount: item.amount,
              total_paid_amount: 0,
            },
      ),
      split_accounts: [
        {
          account_id: product.owner.id,
          account_type: 'seller',
          amount: transaction_data.producer_receives,
          amount_paid: 0,
          amount_tax: transaction_data.producer_tax,
          paid: false,
          account_transaction_id: '',
          amount_refunded: 0,
          days_to_receive:
            payment_method !== 'CREDIT_CARD'
              ? 0
              : getDaysFromTaxFrequency(product.owner.tax_frequency),
          secure_reserve_value: transaction_data.totalSecureReserve,
          secure_reserve_tax: transaction_data.secure_reserve_tax,
        },
        ...transaction_data.participants.map((item) => ({
          account_id: item.user_id,
          account_type: item.type.toLowerCase(),
          amount: item.receives,
          amount_tax: item.tax,
          amount_paid: 0,
          paid: false,
          account_transaction_id: '',
          amount_refunded: 0,
          days_to_receive: item.days_to_receive,
        })),
      ],
      additional_info: {
        requester: requester,
      },
    });

    let transaction = await this.transactionsRepository.create(
      transaction_schema,
    );

    const transactionBuyerUpdate = new TransactionBuyer({
      ...buyer,
      transaction_id: transaction.id,
    });

    await this.transactionsBuyersRepository.update(transactionBuyerUpdate);

    transaction = await this.transactionsRepository.find({
      where: { id: transaction.id },
      relations: ['seller', 'buyer', 'product'],
    });

    // Call payment service

    const schemaPayment: ExecutePaymentDTO = {
      payer: {
        first_name: buyer.name.split(' ')[0],
        last_name: buyer.name.split(' ')[1],
        email: buyer.email.toLowerCase(),
        phone: buyer?.phone,
        identity: buyer.document,
        address: buyer.address
          ? {
              cep: buyer.address.cep,
              city: buyer.address.city,
              neighborhood: buyer.address.neighborhood,
              state: buyer.address.state,
              street: buyer.address.street,
              complement: buyer.address.complement,
              number: buyer.address.number,
            }
          : null,
      },
      seller_name: product.owner.name,
      items: [
        {
          id: product.id,
          title: product.title,
          description: product.title,
          quantity: 1,
          unit_price: product_price,
          category_id: product.category_id,
        },
      ],
      transaction,
      total_value,
      product_gateway: product.gateway,
    };

    if (payment_method === 'CREDIT_CARD') {
      schemaPayment.card_data = {
        ...card_data[0],
      };
      schemaPayment.total_value = transaction_data.transactions[0].amount;
      schemaPayment.installments = card_data[0].installment;
    }

    const provider = {
      CREDIT_CARD: this.executeCreditCardPaymentCase,
      PIX: this.executePixPaymentCase,
      BANK_SLIP: this.executeBankSlipPaymentCase,
    };

    const payment_data = await provider[payment_method].execute(schemaPayment);

    return {
      transaction_id: transaction.id,
      total_value,
      status: payment_data.status,
      email: buyer.email,
      product: {
        id: product.id,
        title: product.title,
      },
      payment_method,
      producer: {
        name: product.producer_name,
        email: product.support_email,
      },
      payment_data,
    };
  }
}
