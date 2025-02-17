import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { GetDashboardMetricsQueryDTO } from '../dtos/GetDashboardMetricsQueryDTO';
import { CheckoutMetricsService } from '../services/checkout_metrics.service';

@Controller('@me/metrics')
export class CheckoutMetricsController {
  constructor(private readonly metricsService: CheckoutMetricsService) {}

  @Get('revenue')
  async getCharts(
    @CurrentUser('user_id') userId: string,
    @Query('period') period: 'today' | '7d' | '14d' | '30d',
  ) {
    return await this.metricsService.getCharts({
      period,
      userId,
    });
  }

  @Get('sales')
  async getSales(
    @CurrentUser('user_id') userId: string,
    @Query() query: GetDashboardMetricsQueryDTO,
  ) {
    return await this.metricsService.getSales({
      ...query,
      userId,
    });
  }

  @Get('old-revenue')
  async getRevenue(
    @CurrentUser('user_id') userId: string,
    @Query() query: GetDashboardMetricsQueryDTO,
  ) {
    return await this.metricsService.getRevenue({
      ...query,
      userId,
    });
  }

  @Get('revenue/period')
  async getRevenueFromPedior(
    @CurrentUser('user_id') userId: string,
    @Query('product') product: string,
  ) {
    return await this.metricsService.getRevenueFromPeriod({
      product,
      userId,
    });
  }

  @Get('checkouts')
  async getCheckouts(
    @CurrentUser('user_id') userId: string,
    @Query() query: GetDashboardMetricsQueryDTO,
  ) {
    return await this.metricsService.getCheckouts({
      ...query,
      userId,
    });
  }
}
