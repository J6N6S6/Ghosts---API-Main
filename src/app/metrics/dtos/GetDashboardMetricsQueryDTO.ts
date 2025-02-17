export interface GetDashboardMetricsQueryDTO {
  start_date: Date;
  end_date: Date;
  userId: string;
  product?: number;
}
