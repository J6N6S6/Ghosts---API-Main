import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';

@Controller('@me/transactions')
export class UserTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async listAllUserTransactions(
    @CurrentUser('user_id') user_id: string,
    @Query()
    query: {
      page?: number;
      items_per_page?: number;
      to_date?: string;
      from_date?: string;
    },
  ) {
    const transactions = await this.transactionsService.listAllUserTransactions(
      {
        filters: {
          from_date: query.from_date,
          to_date: query.to_date,
        },
        user_id,
        page: query.page ?? 1,
        items_per_page: query.items_per_page ?? 10,
      },
    );

    return {
      hasError: false,
      transactions,
    };
  }
}
