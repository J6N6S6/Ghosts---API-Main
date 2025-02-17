import { IsOptional } from 'class-validator';

export class UpdateBankAccountBody {
  @IsOptional()
  public name: string;

  @IsOptional()
  public is_corporate: boolean;

  @IsOptional()
  public bank_name: string;

  @IsOptional()
  public pix_key: string;

  @IsOptional()
  public pix_type: string;

  @IsOptional()
  public bank_agency: string;

  @IsOptional()
  public bank_account: string;

  @IsOptional()
  public bank_account_type: 'CC' | 'CP';
}
