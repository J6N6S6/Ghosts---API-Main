import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateCoProducerBody {
  @IsNotEmpty()
  co_producer_email: string;

  @IsNotEmpty()
  @Min(1)
  @Max(75)
  commission: number;

  @IsOptional()
  @Max(75)
  commission_order_bump?: number;
}
