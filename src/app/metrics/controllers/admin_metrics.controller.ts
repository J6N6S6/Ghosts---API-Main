import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CheckoutMetricsService } from '../services/checkout_metrics.service';
import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { GetAdminChartDto } from '../useCases/get-admin-chart/get_admin_chart.dto';
import { AdminMetricsDTO } from '../useCases/get-admin-metrics/get_admin_metrics.dto';

@Controller('@admin/metrics')
export class AdminMetricsController {
  constructor(private readonly metricsService: CheckoutMetricsService) {}
  @IsAdmin()
  @Get('revenue')
  getDashboardMetrics(@Query() query: AdminMetricsDTO) {
    return this.metricsService.getAdminMetrics(query);
  }

  @IsAdmin()
  @Get('revenue/chart')
  getRevenueChartMetrics(@Query('period') period: GetAdminChartDto['period']) {
    return this.metricsService.getAdminChartMetrics({ period });
  }
}
