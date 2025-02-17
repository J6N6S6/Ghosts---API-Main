export interface CreateWarnDTO {
  title: string;
  description?: string;
  status: 'CRITICAL' | 'LOW';
  created_by: string;
}
