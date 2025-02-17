export interface UpdateUserPasswordDTO {
  user_id: string;
  current_password: string;
  new_password: string;
}
