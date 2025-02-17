import { Reward } from '@/domain/models/rewards.model';
import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { Rewards } from '@/infra/database/entities/rewards.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormRewardsRepository implements RewardsRepository {
  constructor(
    @InjectRepository(Rewards)
    private readonly rewardsRepository: Repository<Rewards>,
  ) {}

  async create(data: Reward): Promise<void> {
    await this.rewardsRepository.save(data.allProps);
  }

  async update(data: Reward): Promise<void> {
    await this.rewardsRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<Rewards> {
    return this.rewardsRepository.findOne({
      where: {
        id,
      },
    });
  }

  findAll(): Promise<Rewards[]> {
    return this.rewardsRepository.find();
  }

  find(options?: FindManyOptions<Rewards>): Promise<Rewards[]> {
    return this.rewardsRepository.find(options);
  }
}
