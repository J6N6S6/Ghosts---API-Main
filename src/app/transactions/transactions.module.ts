import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GatewaysModule } from '../gateways/gateways.module';
import { IpnModule } from '../ipn/ipn.module';
import { MetricsModule } from '../metrics/metrics.module';
import { AdminTransactionsController } from './controllers/admin_transactions.controller';
import { TransactionsController } from './controllers/transactions.controller';
import { UserTransactionsController } from './controllers/user_transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { CancelAndRefundTransactionCase } from './useCases/cancel-and-refund-transaction/cancel_and_refund_transaction.case';
import { GetProductsMostSalesCase } from './useCases/get-products-most-sales/get_products_most_sales.case';
import { ListAdminTransactionsCase } from './useCases/list-admin-transactions/list_admin_transactions.case';
import { ListUserTransactionsCase } from './useCases/list-user-transactions/list_user_transactions.case';
import { SalesRecordCase } from './useCases/sales-record/sales_record.case';
import { ListAdminTransactionsMetricsCase } from './useCases/list-admin-transactions-metrics/list_admin_transactions_metrics.case';

@Module({
  imports: [InfraModule, IpnModule, JwtModule, MetricsModule, GatewaysModule],
  controllers: [
    TransactionsController,
    UserTransactionsController,
    AdminTransactionsController,
  ],
  providers: [
    SalesRecordCase,
    CancelAndRefundTransactionCase,
    TransactionsService,
    ListUserTransactionsCase,
    GetProductsMostSalesCase,
    ListAdminTransactionsCase,
    ListAdminTransactionsMetricsCase,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
