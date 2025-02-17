export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  password: string;
  invite_code: string | null;
}
