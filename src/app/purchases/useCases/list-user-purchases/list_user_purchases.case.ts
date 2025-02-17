import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Purchases } from '@/infra/database/entities/purchases.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserPurchasesCase {
  constructor(private readonly purchasesRepository: PurchasesRepository) {}

  async execute(user_id: string): Promise<Purchases[]> {
    return this.purchasesRepository.findAllByUserId(user_id);
  }
}
