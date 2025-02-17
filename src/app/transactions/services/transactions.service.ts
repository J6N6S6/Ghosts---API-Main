import { Injectable } from '@nestjs/common';
import { listAllAdminTransactionsDTO } from '../dtos/listAllAdminTransactionsDTO';
import { listAllTransactionsDTO } from '../dtos/listAllTransactionsDTO';
import { listAllUserTransactionsDTO } from '../dtos/listAllUserTransactionsDTO';
import { CancelAndRefundTransactionCase } from '../useCases/cancel-and-refund-transaction/cancel_and_refund_transaction.case';
import { CancelAndRefundTransactionDTO } from '../useCases/cancel-and-refund-transaction/cancel_and_refund_transaction.dto';
import { GetProductsMostSalesCase } from '../useCases/get-products-most-sales/get_products_most_sales.case';
import { GetProductsMostSalesDTO } from '../useCases/get-products-most-sales/get_products_most_sales.dto';
import { ListAdminTransactionsCase } from '../useCases/list-admin-transactions/list_admin_transactions.case';
import { ListUserTransactionsCase } from '../useCases/list-user-transactions/list_user_transactions.case';
import { SalesRecordCase } from '../useCases/sales-record/sales_record.case';
import { ListAdminTransactionsMetricsCase } from '../useCases/list-admin-transactions-metrics/list_admin_transactions_metrics.case';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly listAdminTransactionsCase: ListAdminTransactionsCase,
    private readonly listAdminTransactionsMetricsCase: ListAdminTransactionsMetricsCase,

    private readonly salesRecordCase: SalesRecordCase,
    private readonly listUserTransactionsCase: ListUserTransactionsCase,
    private readonly cancelAndRefundTransactionCase: CancelAndRefundTransactionCase,
    private readonly getProductsMostSalesCase: GetProductsMostSalesCase,
  ) {}

  listAllAdminTransactions(data: listAllAdminTransactionsDTO) {
    return this.listAdminTransactionsCase.execute(data);
  }

  listAdminTransactionsMetrics(data: listAllAdminTransactionsDTO) {
    return this.listAdminTransactionsMetricsCase.execute(data);
  }

  listAllTransactions(data: listAllTransactionsDTO) {
    return this.salesRecordCase.execute(data);
  }

  listAllUserTransactions(data: listAllUserTransactionsDTO) {
    return this.listUserTransactionsCase.execute(data);
  }

  refundAndCancelTransaction(data: CancelAndRefundTransactionDTO) {
    return this.cancelAndRefundTransactionCase.execute(data);
  }

  getProductsMostSales(data: GetProductsMostSalesDTO) {
    return this.getProductsMostSalesCase.execute(data);
  }
}
