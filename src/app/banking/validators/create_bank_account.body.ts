import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBankAccountBody {
  @IsOptional()
  public name: string;

  @IsBoolean()
  public is_corporate: boolean;

  @IsNotEmpty()
  public bank_name: string;

  @IsNotEmpty()
  public pix_key: string;

  @IsNotEmpty()
  public pix_type: string;

  @IsNotEmpty()
  public bank_agency: string;

  @IsNotEmpty()
  public bank_account: string;

  @IsNotEmpty()
  public bank_account_type: 'CC' | 'CP';
}
