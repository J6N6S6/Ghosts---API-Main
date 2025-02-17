import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class AuthRegisterBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ValidateIf((o) => !o.cnpj)
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  cpf: string;

  @ValidateIf((o) => !o.cpf)
  @IsString()
  @MinLength(14)
  @MaxLength(14)
  cnpj: string;

  @IsOptional()
  @IsString()
  invite_code: string | null;
}
