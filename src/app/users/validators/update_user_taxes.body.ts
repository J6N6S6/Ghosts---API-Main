import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserTaxesBody {
  @IsNotEmpty()
  @IsEnum(['2d', '7d', '15d', '30d'])
  tax_frequency?: `${number}d`;
}
