export interface ChangePasswordTokenDTO {
  ip_address: string;
  email: string;
  token: string;
  password: string;
  user_agent: string;
  session_origin: string;
}
