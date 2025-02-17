import { Purchase } from '@/domain/models/purchases.model';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Purchases } from '@/infra/database/entities/purchases.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormPurchasesRepository implements PurchasesRepository {
  constructor(
    @InjectRepository(Purchases)
    private readonly PurchasesRepository: Repository<Purchases>,
  ) {}

  async create(data: Purchase): Promise<void> {
    await this.PurchasesRepository.save(data.allProps);
  }

  async update(data: Purchase): Promise<void> {
    await this.PurchasesRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<Purchases> {
    return this.PurchasesRepository.findOneBy({ id });
  }

  findBy(options: FindOneOptions<Purchases>): Promise<Purchases> {
    return this.PurchasesRepository.findOne(options);
  }

  findByUserIdAndProductId(
    user_id: string,
    product_id: string,
  ): Promise<Purchases> {
    return this.PurchasesRepository.findOneBy({
      user_id,
      product_id,
    });
  }

  findAllByUserId(user_id: string): Promise<Purchases[]> {
    return this.PurchasesRepository.find({
      where: { user_id },
      relations: ['product', 'product.category', 'product.owner'],
      select: {
        id: true,
        user_id: true,
        evaluation: true,
        transaction_id: true,
        product: {
          id: true,
          title: true,
          product_type: true,
          category_id: true,
          image: true,
          category: {
            id: true,
            title: true,
          },
          owner: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  find(options?: FindManyOptions<Purchases>): Promise<Purchases[]> {
    return this.PurchasesRepository.find(options);
  }

  findAllByTransactionId(transaction_id: string): Promise<Purchases[]> {
    return this.PurchasesRepository.find({
      where: { transaction_id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.PurchasesRepository.delete(id);
  }

  async count(options?: FindManyOptions<Purchases>): Promise<number> {
    return this.PurchasesRepository.count(options);
  }
}
