import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BalanceRegularizationProcessor } from './queue/balance_regularization.processor';
import { ProcessBalanceRegularizationProcessor } from './queue/process_balance_regularization.processor';
import { InfraModule } from '@/infra/infra.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IpnModule } from '../ipn/ipn.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminWithdrawController } from './controllers/admin_withdraw.controller';
import { UsersBankAccountsController } from './controllers/users_bank.controller';
import { WithdrawController } from './controllers/withdraw.controller';
import { UsersBankingService } from './services/users_banking.service';
import { WithdrawService } from './services/withdraw.service';
import { ApproveWithdrawCase } from './useCases/approve-withdraw/approve_withdraw.case';
import { CreateBankAccountCase } from './useCases/create-bank-account/create_bank_account.case';
import { DeclineWithdrawCase } from './useCases/decline-withdraw/decline_withdraw.case';
import { DeleteBankAccountCase } from './useCases/delete-bank-account/delete_bank_account.case';
import { GetAccountBalanceCase } from './useCases/get-account-balance/get_account_balance.case';
import { GetBankAccountCase } from './useCases/get-bank-account/get_bank_account.case';
import { GetWithdrawHistoryCase } from './useCases/get-withdraw-history/get_withdraw_history';
import { ListPendingBalanceCase } from './useCases/list-pending-balance/list_pending_balance';
import { RequestWithdrawCase } from './useCases/request-withdraw/request_withdraw.case';
import { UpdateBankAccountCase } from './useCases/update-bank-account/update_bank_account.case';
import { WithdrawalsControlCase } from './useCases/withdrawals-control/withdrawals_control.case';
import { WithdrawalsSecretCase } from './useCases/withdrawals-secret/withdrawals_secret.case';
import { ProcessWithdrawCase } from './useCases/process-withdraw/process_withdraw.case';
import { WithdrawalQueueService } from './queue/withdraw.queue';
import { BullModule } from '@nestjs/bull';
import { WithdrawalsControlMetricsCase } from './useCases/withdrawals-control-metrics/withdrawals_control_metrics.case';
import { SettleUserReservedBalance } from './useCases/settle-user-reserved-balance/settle-user-reserved-balance.case';
import { SettleUserReservedBalancelQueueService } from './queue/settle_user_reserved_balance.queue';
import { GetUserTaxesCase } from './useCases/get-user-taxes/get-user-taxes.case';
import { ProcessSecureReserveTransaction } from './useCases/process-secure-reserve-transaction/process-secure-reserve-transaction.case';
import { ApproveAutomaticWithdrawCase } from './useCases/approve-automatic-withdraw/approve_automatic_withdraw.case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BalanceRegularizationCase } from './useCases/balance-regularization/balance-regularization.case';
import { ProcessBalanceRegularizationCase } from './useCases/process-balance-regularization/process-balance-regularization.case';

@Module({
  imports: [
    InfraModule,
    IpnModule,
    HttpModule,
    NotificationsModule,
    BullModule.registerQueue({
      name: 'withdraw_request',
    }),
    BullModule.registerQueue({
      name: 'settle_user_reserved_balance',
    }),
    BullModule.registerQueue({
      name: 'process_secure_reserve_transaction',
    }),
    BullModule.registerQueue({
      name: 'balance_regularization',
    }),
    BullModule.registerQueue({
      name: 'process_balance_regularization',
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {};
      },
    }),
  ],
  controllers: [
    UsersBankAccountsController,
    WithdrawController,
    AdminWithdrawController,
  ],
  providers: [
    BalanceRegularizationProcessor,
    ProcessBalanceRegularizationProcessor,
    CreateBankAccountCase,
    GetAccountBalanceCase,
    GetBankAccountCase,
    RequestWithdrawCase,
    UpdateBankAccountCase,
    UsersBankingService,
    DeleteBankAccountCase,
    WithdrawalsControlCase,
    DeclineWithdrawCase,
    ApproveWithdrawCase,
    WithdrawService,
    ListPendingBalanceCase,
    GetWithdrawHistoryCase,
    WithdrawalsSecretCase,
    ProcessWithdrawCase,
    WithdrawalQueueService,
    WithdrawalsControlMetricsCase,
    SettleUserReservedBalance,
    SettleUserReservedBalancelQueueService,
    GetUserTaxesCase,
    ProcessSecureReserveTransaction,
    ApproveAutomaticWithdrawCase,
    BalanceRegularizationCase,
    ProcessBalanceRegularizationCase,
  ],
  exports: [UsersBankingService],
})
export class BankAccountsModule {}
