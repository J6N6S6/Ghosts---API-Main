import { IsOptional, Max, Min } from 'class-validator';

export class UpdateCoProducerBody {
  @IsOptional()
  @Min(1)
  @Max(75)
  commission?: number;

  @IsOptional()
  @Max(75)
  commission_order_bump?: number;
}
