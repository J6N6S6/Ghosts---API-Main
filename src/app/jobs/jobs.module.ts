import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BalanceRegularizationProcessor } from './balance_regularization.processor';
import { ProcessBalanceRegularizationProcessor } from './process_balance_regularization.processor';
import { BalanceRegularizationCase } from '../banking/useCases/balance-regularization/balance-regularization.case';
import { ProcessBalanceRegularizationCase } from '../banking/useCases/process-balance-regularization/process-balance-regularization.case';
import { BankAccountsModule } from '../banking/user_banking.module';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'process_balance_regularization' },
      { name: 'balance_regularization' },
      { name: 'withdraw_request' },
      { name: 'settle_user_reserved_balance' },
      { name: 'process_secure_reserve_transaction' },
    ),
    BankAccountsModule,
  ],
  providers: [
    ProcessBalanceRegularizationProcessor,
    BalanceRegularizationProcessor,
    ProcessBalanceRegularizationCase,
    BalanceRegularizationCase,
  ],
  exports: [ProcessBalanceRegularizationCase, BalanceRegularizationCase],
})
export class JobsModule {}
