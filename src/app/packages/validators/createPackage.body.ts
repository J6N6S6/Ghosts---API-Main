import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePackageBody {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
