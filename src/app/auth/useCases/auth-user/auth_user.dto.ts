export interface AuthUserDTO {
  email: string;
  password: string;
  ip_address: string;
  user_agent?: string;
  session_origin?: string;
}
