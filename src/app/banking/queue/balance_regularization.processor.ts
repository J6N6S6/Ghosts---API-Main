import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { BalanceRegularizationCase } from '../useCases/balance-regularization/balance-regularization.case';

@Processor('balance_regularization_processor')
export class BalanceRegularizationProcessor {
  constructor(private readonly balanceRegCase: BalanceRegularizationCase) {}

  @Process('run_balance_regularization')
  async handle(job: Job<any>) {
    try {
      await this.balanceRegCase.execute(job);
    } catch (err) {
      console.error('Erro no balance_regularization:', err);
    }
  }
}
