import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { WithdrawService } from '../services/withdraw.service';
import { RequestWithdrawBody } from '../validators/request_withdraw.body';

@Controller('@me/withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post('request')
  @Throttle(1, 10)
  async RequestWithdraw(
    @CurrentUser('user_id') user_id: string,
    @Body() body: RequestWithdrawBody,
  ) {
    await this.withdrawService.requestWithdraw({
      user_id,
      ...body,
    });

    return {
      hasError: false,
      message: 'Saque solicitado com sucesso',
    };
  }

  @Get('history')
  async getWithdrawHistory(
    @CurrentUser('user_id') user_id: string,
    @Query('page') page = 1,
  ) {
    const withdraws = await this.withdrawService.getWithdrawHistory({
      user_id,
      page,
    });

    return {
      hasError: false,
      data: withdraws,
    };
  }
}
