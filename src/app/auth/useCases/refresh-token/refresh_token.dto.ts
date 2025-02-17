export interface RefreshTokenDTO {
  refresh_token: string;
  ip_address: string;
  user_agent?: string;
  session_origin?: string;
}
