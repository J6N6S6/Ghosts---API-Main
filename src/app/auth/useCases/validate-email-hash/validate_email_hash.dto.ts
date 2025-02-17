export interface ValidateEmailHashDTO {
  email: string;
  hash: string;
  ip_address: string;
  user_agent?: string;
  session_origin?: string;
}
