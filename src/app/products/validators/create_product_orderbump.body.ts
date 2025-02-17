import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateProductOrderbumpBody {
  @IsNotEmpty()
  @IsString()
  bump_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  product_link: string;

  @IsOptional()
  @IsString()
  aux_phrase: string;

  @IsOptional()
  @IsString()
  sell_phrase: string;
}
