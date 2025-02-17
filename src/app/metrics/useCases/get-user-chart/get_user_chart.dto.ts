export interface GetUserChartDto {
  period: 'today' | '7d' | '14d' | '30d';
  userId: string;
}

export interface GetUserChartResponse {
  hasError: boolean;
  data: {
    labels: string[];
    data: number[];
  };
}
