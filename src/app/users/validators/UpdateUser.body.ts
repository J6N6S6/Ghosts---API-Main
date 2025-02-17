import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class additionalInfo {
  @IsOptional()
  public birthday?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  public gender?: 'male' | 'female' | 'other';

  @IsOptional()
  public instagram?: string;
}

class address {
  @IsOptional()
  public postal_code: string;
  @IsOptional()
  public city: string;
  @IsOptional()
  public street: string;
  @IsOptional()
  public number?: string;
  @IsOptional()
  public complement?: string;
  @IsOptional()
  public neighborhood: string;
  @IsOptional()
  public state: string;
}

export class UpdateUserBody {
  @IsOptional()
  public name?: string;

  @IsOptional()
  public name_exibition?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined)
  @ValidateNested()
  @Type(() => additionalInfo)
  public additional_info?: additionalInfo;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined)
  public cpf?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined)
  public cnpj?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined)
  public rg?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined)
  @ValidateNested()
  @Type(() => address)
  public address?: address;
}
