export interface GetAdminChartDto {
  period: 'today' | '7d' | '14d' | '30d';
}

export interface GetUserChartResponse {
  hasError: boolean;
  data: {
    labels: string[];
    data: number[];
  };
}
