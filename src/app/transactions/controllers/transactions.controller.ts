import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { listAllTransactionsQuery } from '../validators/list_all_transactions.query';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async listAllTransactions(
    @CurrentUser('user_id') user_id: string,
    @Query() query: listAllTransactionsQuery,
  ) {
    const transactions = await this.transactionsService.listAllTransactions({
      ...query,
      user_id,
    });

    return {
      hasError: false,
      data: transactions,
    };
  }

  @Post('refund/:transaction_id')
  async refundTransaction(
    @CurrentUser('user_id') user_id: string,
    @Param('transaction_id') transaction_id: string,
  ) {
    await this.transactionsService.refundAndCancelTransaction({
      transaction_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Transação estornada com sucesso',
    };
  }
}
