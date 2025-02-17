import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductLinkBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(9)
  price: number;
}
