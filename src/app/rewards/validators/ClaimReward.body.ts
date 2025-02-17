import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClaimRewardBody {
  @IsString()
  @IsNotEmpty()
  reward_id: string;

  @IsOptional()
  delivery_data?: any;
}
