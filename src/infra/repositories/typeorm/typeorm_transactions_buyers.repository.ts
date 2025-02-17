import { TransactionBuyer } from '@/domain/models/transaction_buyer.model';
import { TransactionsBuyersRepository } from '@/domain/repositories/transactions_buyers.repository';
import { TransactionsBuyers } from '@/infra/database/entities/transactions_buyers.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormTransactionsBuyersRepository
  implements TransactionsBuyersRepository
{
  constructor(
    @InjectRepository(TransactionsBuyers)
    private readonly transactionsBuyersRepository: Repository<TransactionsBuyers>,
  ) {}

  async create(data: TransactionBuyer): Promise<TransactionsBuyers> {
    return await this.transactionsBuyersRepository.save(data.allProps);
  }

  async update(data: TransactionBuyer): Promise<void> {
    await this.transactionsBuyersRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<TransactionsBuyers> {
    return this.transactionsBuyersRepository.findOneBy({ id });
  }

  findByVisitorId(visitor_id: string): Promise<TransactionsBuyers> {
    return this.transactionsBuyersRepository.findOneBy({ visitor_id });
  }

  findBy(
    where?: FindOneOptions<TransactionsBuyers>,
  ): Promise<TransactionsBuyers> {
    return this.transactionsBuyersRepository.findOne(where);
  }

  findAll(
    options?: FindManyOptions<TransactionsBuyers>,
  ): Promise<TransactionsBuyers[]> {
    return this.transactionsBuyersRepository.find(options);
  }
}
