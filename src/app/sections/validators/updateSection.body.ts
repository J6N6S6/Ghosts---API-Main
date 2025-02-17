import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSectionBody {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  products: string[];
}
