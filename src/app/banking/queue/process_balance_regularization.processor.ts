import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ProcessBalanceRegularizationCase } from '../useCases/process-balance-regularization/process-balance-regularization.case';

@Processor('process_balance_regularization')
export class ProcessBalanceRegularizationProcessor {
  constructor(
    private readonly processBalanceRegCase: ProcessBalanceRegularizationCase,
  ) {}

  @Process('run_process_balance_regularization')
  async handle(job: Job<any>) {
    try {
      await this.processBalanceRegCase.process(job);
    } catch (err) {
      console.error('Erro no process_balance_regularization:', err);
    }
  }
}
