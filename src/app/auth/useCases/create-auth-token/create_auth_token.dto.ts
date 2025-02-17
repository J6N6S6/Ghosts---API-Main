export interface CreateAuthTokenDTO {
  user_id: string;
  ip_address: string;
  user_agent: string;
  session_origin: string;
  is_login_as_another_user?: boolean;
  metadata?: any;
}
