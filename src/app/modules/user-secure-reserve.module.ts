// src/app/modules/user-secure-reserve.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSecureReserveTransactionsEntity } from '@/infra/database/entities/user_secure_reserve_transactions.entity';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { TypeormUserSecureReserveRepository } from '@/infra/repositories/typeorm/typeorm_user_secure_reserve.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSecureReserveTransactionsEntity])],
  providers: [
    {
      provide: IEUserSecureReserveRepository,
      useClass: TypeormUserSecureReserveRepository,
    },
  ],
  exports: [IEUserSecureReserveRepository],
})
export class UserSecureReserveModule {}
