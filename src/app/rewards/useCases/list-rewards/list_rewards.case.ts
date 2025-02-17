import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListRewardsCase {
  constructor(private readonly rewardsRepository: RewardsRepository) {}

  async execute() {
    return await this.rewardsRepository.findAll();
  }
}
