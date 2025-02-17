import { Reward } from '@/domain/models/rewards.model';
import { Rewards } from '@/infra/database/entities/rewards.entity';
import { FindManyOptions } from 'typeorm';

export abstract class RewardsRepository {
  abstract create(data: Reward): Promise<void>;
  abstract update(data: Reward): Promise<void>;
  abstract findById(id: Reward['id']): Promise<Rewards>;
  abstract findAll(): Promise<Rewards[]>;

  abstract find(options?: FindManyOptions<Rewards>): Promise<Rewards[]>;
}
