import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSectionBody {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  products: string[];
}
