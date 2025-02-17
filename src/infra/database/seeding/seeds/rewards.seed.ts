import { Reward } from '@/domain/models/rewards.model';
import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Rewards } from '../../entities/rewards.entity';

@Injectable()
export class RewardsSeed implements OnModuleInit {
  constructor(private readonly rewardsRepository: RewardsRepository) {}

  async onModuleInit(): Promise<void> {
    const rewards = await this.rewardsRepository.findAll();
    if (rewards.length >= 1) return;

    const rewardsSeed: Rewards[] = [
      {
        title: 'Pulseira 10k',
        description: 'Pulseira de R$ 10.000 em vendas',
        available: true,
        delivery_mode: 'address',
        goal: 10000,
      },
      {
        title: 'Placa de 100K',
        description: 'Placa de 100k em vendas',
        available: true,
        delivery_mode: 'address',
        goal: 100000,
        image: '',
      },
      {
        title: 'Placa de 500K',
        description: 'Placa de 500k em vendas',
        available: true,
        delivery_mode: 'address',
        goal: 500000,
        image: '',
      },
      {
        title: 'Placa de 1MM',
        description: 'Placa de 1MM em vendas',
        available: true,
        delivery_mode: 'address',
        goal: 1000000,
        image: '',
      },
    ];

    for (const reward of rewardsSeed) {
      const rewardModel = new Reward(reward);
      await this.rewardsRepository.create(rewardModel);
    }
  }
}
