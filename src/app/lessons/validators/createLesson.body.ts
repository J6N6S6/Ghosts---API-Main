import { toBoolean } from '@/helpers/transform.helper';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateLessonBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  module_id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value))
  draft: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value))
  comments: boolean;

  @IsOptional()
  @ValidateIf((o, v) => v !== undefined && v !== '')
  @IsUrl({
    require_host: true,
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['https'],
    host_whitelist: [
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'player.vimeo.com',
    ],
  })
  video_url?: string;

  @IsOptional()
  @IsString()
  background?: string;

  @IsNotEmpty()
  @IsEnum(['immediate', 'programmed'])
  availability: 'immediate' | 'programmed';

  @IsOptional()
  @ValidateIf((o) => o.availability === 'programmed')
  @IsEnum(['scheduled', 'timer'])
  availability_type?: 'scheduled' | 'timer';

  @IsOptional()
  @ValidateIf((o) => o.availability_type === 'scheduled')
  availability_date?: Date;

  @IsOptional()
  @ValidateIf((o) => o.availability_type === 'timer')
  @IsNumber()
  @Transform(({ value }) => Number(value))
  availability_days?: number;

  // @IsOptional()
  // @IsString()
  // materials: {
  //   title: string;
  //   type: 'link' | 'file';
  //   content: string;
  // }[];
}
