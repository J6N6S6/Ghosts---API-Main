// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateNewSessionDto {
  user_email: string;
  access_token: string;
  refresh_token: string;
  origin: string;
  available_balance: string;
}
