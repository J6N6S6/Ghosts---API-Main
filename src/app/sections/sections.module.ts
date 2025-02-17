import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra/infra.module';
import { SectionsController } from './controllers/sections.controller';
import { ListPackageSectionsCase } from './useCases/list-package-sections/list_package_sections.case';
import { CreateSectionCase } from './useCases/create-section/create_section.case';
import { UpdateSectionCase } from './useCases/update-section/update_section.case';
import { DeleteSectionCase } from './useCases/delete-section/delete_section.case';
import { SectionsService } from './services/sections.service';
@Module({
  imports: [InfraModule],
  providers: [
    SectionsService,
    ListPackageSectionsCase,
    CreateSectionCase,
    UpdateSectionCase,
    DeleteSectionCase,
  ],
  controllers: [SectionsController],
  exports: [SectionsService],
})
export class SectionsModule {}
