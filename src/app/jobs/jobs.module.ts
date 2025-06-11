import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BalanceRegularizationProcessor } from './balance_regularization.processor';
import { ProcessBalanceRegularizationProcessor } from './process_balance_regularization.processor';
import { BankAccountsModule } from '../banking/user_banking.module';
import { BalanceRegularizationCase } from '../banking/useCases/balance-regularization/balance-regularization.case';
import { TypeormUserSecureReserveRepository } from 'src/infra/repositories/typeorm/typeorm_user_secure_reserve.repository';

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
    BalanceRegularizationCase,
    {
      provide: 'IEUserSecureReserveRepository',
      useClass: TypeormUserSecureReserveRepository,
    },
  ],
  exports: [
    ProcessBalanceRegularizationProcessor,
    BalanceRegularizationProcessor,
    BalanceRegularizationCase,
  ],
})
export class JobsModule {}
