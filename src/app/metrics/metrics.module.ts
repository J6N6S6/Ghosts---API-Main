import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra/infra.module';
import { GetUserChartCase } from './useCases/get-user-chart/get_user_chart.case';
import { GetUserCheckoutsCase } from './useCases/get-user-checkouts/get_user_checkouts.case';
import { GetUserRevenueCase } from './useCases/get-user-revenue/get_user_revenue.case';
import { GetUserSalesCase } from './useCases/get-user-sales/get_user_sales.case';
import { CheckoutMetricsService } from './services/checkout_metrics.service';
import { CheckoutMetricsController } from './controllers/checkout_metrics.controller';
import { AdminMetricsController } from './controllers/admin_metrics.controller';
import { GetAdminMetricsCase } from './useCases/get-admin-metrics/get_admin_metrics.case';
import { GetAdminChartCase } from './useCases/get-admin-chart/get_admin_chart.case';

@Module({
  imports: [InfraModule],
  controllers: [CheckoutMetricsController, AdminMetricsController],
  providers: [
    GetUserChartCase,
    GetUserCheckoutsCase,
    GetUserRevenueCase,
    GetUserSalesCase,
    CheckoutMetricsService,
    GetAdminMetricsCase,
    GetAdminChartCase,
  ],
  exports: [CheckoutMetricsService],
})
export class MetricsModule {}
