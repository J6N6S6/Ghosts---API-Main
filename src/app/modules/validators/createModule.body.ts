import { toBoolean } from '@/helpers/transform.helper';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModuleBody {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value))
  show_title: boolean;
}
