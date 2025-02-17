export interface ApiCreateUserDTO {
  email: string;
  phone_number: string;
  name: string;
  password: string;
  person_type: 'PF' | 'PJ';
}
