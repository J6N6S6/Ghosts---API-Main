import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'process_balance_regularization' },
      { name: 'balance_regularization' },
      { name: 'withdraw_request' },
      { name: 'settle_user_reserved_balance' },
      { name: 'process_secure_reserve_transaction' },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
