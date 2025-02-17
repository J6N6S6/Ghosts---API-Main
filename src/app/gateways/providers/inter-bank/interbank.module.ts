import { Module } from '@nestjs/common';
import { InterBankService } from './interbank.service';

@Module({
  imports: [],
  providers: [InterBankService],
  exports: [InterBankService],
})
export class InterBankModule {}
