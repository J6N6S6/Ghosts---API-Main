import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVoucherBody {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  deadline: Date;
}
