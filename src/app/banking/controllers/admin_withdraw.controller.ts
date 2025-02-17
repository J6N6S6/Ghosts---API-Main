import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WithdrawService } from '../services/withdraw.service';
import { WithdrawalsControlDTO } from '../useCases/withdrawals-control/withdrawals_control.dto';

@Controller('@admin')
export class AdminWithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Get('secret/withdraw/list')
  @IsPublic()
  async listSecretWithdrawals(@Query('secret') secret: string) {
    if (secret !== 'A947310E0A819BAECE509F3DF048047F861A90EB27E80CFEB057B144') {
      return {
        hasError: true,
        message: 'Acesso negado',
      };
    }

    const withdrawals = await this.withdrawService.listSecretWithdrawals();

    return {
      hasError: false,
      data: withdrawals,
    };
  }

  @Get('withdraw/list/:type')
  @IsAdmin()
  async RequestWithdraw(
    @Param('type') type: WithdrawalsControlDTO['type'],
    @Query()
    data: Exclude<WithdrawalsControlDTO, 'type'>,
  ) {
    const withdrawals = await this.withdrawService.listWithdrawalsControl({
      type,
      ...data,
    });

    return {
      hasError: false,
      data: withdrawals,
    };
  }

  @Get('withdraw/metrics/:user_id')
  @IsAdmin()
  async GetWithdrawMetricsForUser(@Param('user_id') user_id: string) {
    const metrics = await this.withdrawService.getWithdrawalsControlMetrics({
      user_id,
    });

    return {
      hasError: false,
      data: metrics,
    };
  }

  @Post('withdraw/approve/:withdraw_id')
  @IsAdmin()
  async approveWithdraw(
    @Param('withdraw_id') withdraw_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.withdrawService.approveWithdraw({ withdraw_id, user_id });

    return {
      hasError: false,
      message: 'Saque aprovado com sucesso',
    };
  }

  @Post('withdraw/approve/automatic/:withdraw_id')
  @IsAdmin()
  async approveAutomaticWithdraw(
    @Param('withdraw_id') withdraw_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.withdrawService.approveAutomaticWithdraw({
      withdraw_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Saque aprovado com sucesso',
    };
  }

  @Post('withdraw/decline/:withdraw_id')
  @IsAdmin()
  async declineWithdraw(
    @Param('withdraw_id') withdraw_id: string,
    @CurrentUser('user_id') user_id: string,
    @Body('reason') reason: string,
  ) {
    await this.withdrawService.declineWithdraw({
      withdraw_id,
      user_id,
      reason,
    });

    return {
      hasError: false,
      message: 'Saque rejeitado com sucesso',
    };
  }
}
