export interface PreCreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
}
