import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { ProcessWithdrawCase } from '../useCases/process-withdraw/process_withdraw.case';
import { RequestWithdrawDTO } from '../useCases/request-withdraw/request_withdraw.dto';

@Injectable()
@Processor('withdraw_request')
export class WithdrawalQueueService {
  constructor(private readonly processWithdrawCase: ProcessWithdrawCase) {}

  @Process()
  async processQueue(job: Job<RequestWithdrawDTO>) {
    let progress = 0;
    for (let i = 0; i < 1; i++) {
      await this.processWithdrawal(job.data);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }

  private async processWithdrawal(request: RequestWithdrawDTO): Promise<void> {
    try {
      await this.processWithdrawCase.execute(request);
    } catch (error) {
      console.error('Error processing withdrawal', error);
    }
  }
}
