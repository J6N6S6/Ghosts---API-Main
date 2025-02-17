import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductLinkBody {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(10)
  price: number;
}
