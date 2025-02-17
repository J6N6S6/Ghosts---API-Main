import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { WarnService } from './services/warns.service';
import { CreateWarnCase } from './useCases/create-warn/create-warn.case';
import { FindWarnByIdCase } from './useCases/find-warn/find-warn-by-id.case';
import { UpdateWarnCase } from './useCases/update-warn/update-warn.case';
import { DeleteWarnCase } from './useCases/delete-warn/delete-warn.case';
import { WarnsController } from './controllers/warns.controller';
import { FindAllWarnsCase } from './useCases/find-all-warns/find-all-warns.case';

@Module({
  imports: [InfraModule],
  providers: [
    CreateWarnCase,
    DeleteWarnCase,
    FindWarnByIdCase,
    FindAllWarnsCase,
    UpdateWarnCase,
    WarnService,
  ],
  controllers: [WarnsController],
  exports: [WarnService],
})
export class WarnsModule {}
