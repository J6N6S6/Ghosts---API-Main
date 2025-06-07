import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { SettleUserReservedBalance } from '../useCases/settle-user-reserved-balance/settle-user-reserved-balance.case';

@Injectable()
@Processor('settle_user_reserved_balance')
export class SettleUserReservedBalancelQueueService {
  constructor(
    private readonly settleUserReservedBalance: SettleUserReservedBalance,
  ) {}

  @Process('run_user_reserved_balance')
  async processQueue(job: Job<any>) {
    let progress = 0;
    for (let i = 0; i < 1; i++) {
      await this.processSettleUserReservedBalance(job.data.user_id);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }

  private async processSettleUserReservedBalance(
    user_id: string,
  ): Promise<void> {
    try {
      await this.settleUserReservedBalance.execute(user_id);
    } catch (error) {
      console.error('Error processing settle user reserved balance', error);
    }
  }
}
