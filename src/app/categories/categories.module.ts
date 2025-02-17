import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra/infra.module';
import { CategoriesController } from './controllers/categories.controller';
import { ListCategoriesCase } from './useCases/list-categories/list-categories.case';
import { CategoriesService } from './services/categories.service';
@Module({
  imports: [InfraModule],
  providers: [ListCategoriesCase, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
