import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetPaymentStatusCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(order_id: string) {
    const transaction = await this.transactionsRepository.find({
      where: { id: order_id },
      relations: ['buyer', 'product'],
    });

    if (!Transaction) throw new ClientException('Pedido não encontrado!');

    return {
      transaction_id: transaction.id,
      total_value: transaction.transaction_amount,
      status: transaction.status,
      email: transaction.buyer.email,
      product: {
        id: transaction.product.id,
        title: transaction.product.title,
      },
      payment_method: transaction.payment_method,
      producer: {
        name: transaction.product.producer_name,
        email: transaction.product.support_email,
      },
      payment_data: transaction.payment_method_details,
    };
  }
}
