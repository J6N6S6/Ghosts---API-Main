import { GetAdminMetricsCase } from './../useCases/get-admin-metrics/get_admin_metrics.case';
import { Injectable } from '@nestjs/common';
import { GetUserChartCase } from '../useCases/get-user-chart/get_user_chart.case';
import { GetUserSalesCase } from '../useCases/get-user-sales/get_user_sales.case';
import { GetUserRevenueCase } from '../useCases/get-user-revenue/get_user_revenue.case';
import { GetUserCheckoutsCase } from '../useCases/get-user-checkouts/get_user_checkouts.case';
import { GetDashboardMetricsQueryDTO } from '../dtos/GetDashboardMetricsQueryDTO';
import * as dayjs from 'dayjs';
import { GetUserChartDto } from '../useCases/get-user-chart/get_user_chart.dto';
import { GetAdminChartCase } from '../useCases/get-admin-chart/get_admin_chart.case';
import { GetAdminChartDto } from '../useCases/get-admin-chart/get_admin_chart.dto';
import { AdminMetricsDTO } from '../useCases/get-admin-metrics/get_admin_metrics.dto';

@Injectable()
export class CheckoutMetricsService {
  constructor(
    private readonly getUserChartCase: GetUserChartCase,
    private readonly getUserSalesCase: GetUserSalesCase,
    private readonly getUserRevenueCase: GetUserRevenueCase,
    private readonly getUserCheckoutsCase: GetUserCheckoutsCase,
    private readonly getAdminMetricsCase: GetAdminMetricsCase,
    private readonly getAdminChartCase: GetAdminChartCase,
  ) {}

  async getCharts(data: GetUserChartDto) {
    return this.getUserChartCase.execute(data);
  }

  async getSales(data: GetDashboardMetricsQueryDTO) {
    return this.getUserSalesCase.execute(data);
  }

  async getRevenue(data: GetDashboardMetricsQueryDTO) {
    return this.getUserRevenueCase.execute(data);
  }

  async getRevenueFromPeriod(data: { userId: string; product: string }) {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    const total_revenue = await Promise.all([
      this.getUserRevenueCase.execute({
        userId: data.userId,
        start_date: today.startOf('day').toDate(),
        end_date: today.endOf('day').toDate(),
        product_id: data.product,
      }),
      this.getUserRevenueCase.execute({
        userId: data.userId,
        start_date: yesterday.startOf('day').toDate(),
        end_date: yesterday.endOf('day').toDate(),
        product_id: data.product,
      }),
      this.getUserRevenueCase.execute({
        userId: data.userId,
        start_date: today.startOf('month').toDate(),
        end_date: today.endOf('month').toDate(),
        product_id: data.product,
      }),
    ]);

    return {
      hasError: false,
      data: {
        today: total_revenue[0].data,
        yesterday: total_revenue[1].data,
        monthly: total_revenue[2].data,
      },
    };
  }

  async getCheckouts(data: GetDashboardMetricsQueryDTO) {
    return this.getUserCheckoutsCase.execute(data);
  }

  async getAdminMetrics(data: AdminMetricsDTO) {
    return this.getAdminMetricsCase.execute(data);
  }

  async getAdminChartMetrics(data: GetAdminChartDto) {
    return this.getAdminChartCase.execute(data);
  }
}
