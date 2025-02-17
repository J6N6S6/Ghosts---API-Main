export interface UpdateUserDTO {
  user_id: string;

  name?: string;
  name_exibition?: string;

  additional_info?: {
    birthday?: string;
    gender?: 'male' | 'female' | 'other';
  };

  cpf?: string;
  cnpj?: string;
  rg?: string;

  address?: {
    postal_code: string;
    city: string;
    street: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    state: string;
  };
}
