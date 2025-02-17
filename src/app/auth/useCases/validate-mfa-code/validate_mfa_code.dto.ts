export interface ValidateMFACodeDTO {
  email: string;
  code: number;
  ip_address: string;
  user_agent?: string;
  session_origin?: string;
}
