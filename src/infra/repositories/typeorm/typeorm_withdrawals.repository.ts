import { Withdraw } from '@/domain/models/withdraw.model';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Withdrawals } from '@/infra/database/entities/withdrawals.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormWithdrawalsRepository implements WithdrawalsRepository {
  constructor(
    @InjectRepository(Withdrawals)
    private readonly withdrawalsRepository: Repository<Withdrawals>,
  ) {}

  async create(data: Withdraw): Promise<void> {
    await this.withdrawalsRepository.save(data.allProps);
  }

  async update(data: Withdraw): Promise<void> {
    await this.withdrawalsRepository.update(data.id, data.allProps);
  }

  async findById(id: string): Promise<Withdrawals> {
    return this.withdrawalsRepository.findOne({
      where: { id },
    });
  }
  findOne(options: FindOneOptions<Withdrawals>): Promise<Withdrawals> {
    return this.withdrawalsRepository.findOne(options);
  }

  findAllByUserId(user_id: string): Promise<Withdrawals[]> {
    return this.withdrawalsRepository.find({
      where: { user_id },
    });
  }

  find(query: FindManyOptions<Withdrawals>): Promise<Withdrawals[]> {
    return this.withdrawalsRepository.find(query);
  }

  count(query: FindManyOptions<Withdrawals>): Promise<number> {
    return this.withdrawalsRepository.count(query);
  }
}
