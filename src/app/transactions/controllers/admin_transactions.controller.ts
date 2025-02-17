import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { listAllTransactionsQuery } from '../validators/list_all_transactions.query';
import { IsAssistent } from '@/app/auth/decorators/endpoint-assistent.decorator';

@Controller('/@admin/transactions')
export class AdminTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @IsAssistent()
  async listAllAdminTransactions(@Query() query: listAllTransactionsQuery) {
    const transactions =
      await this.transactionsService.listAllAdminTransactions(query);

    return {
      hasError: false,
      data: transactions,
    };
  }

  @Get('/metrics')
  @IsAssistent()
  async listAdminTransactionsMetrics(@Query() query: listAllTransactionsQuery) {
    const transactions =
      await this.transactionsService.listAdminTransactionsMetrics(query);

    return {
      hasError: false,
      data: transactions,
    };
  }
}
