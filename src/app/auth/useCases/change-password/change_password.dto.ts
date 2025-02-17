export interface ChangePasswordDTO {
  user_id: string;
  old_password: string;
  new_password: string;
  ip_address: string;
  session_secret?: string;
}
