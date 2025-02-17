import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRewardStatusBody {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending_delivery', 'delivered'])
  status: 'pending_delivery' | 'delivered';
}
