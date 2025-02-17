import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ProductsAffiliatesController } from './controllers/products_affiliates.controller';
import { ProductsAffiliatesService } from './services/products_affiliates.service';
import { AffiliationActionControlCase } from './useCases/affiliation-action-control/affiliation_action_control.case';
import { ListAffiliationsCase } from './useCases/list-affiliation/list_affiliations.case';
import { RequestAffiliationCase } from './useCases/request-affiliation/request_affiliation.case';

@Module({
  imports: [InfraModule],
  controllers: [ProductsAffiliatesController],
  providers: [
    RequestAffiliationCase,
    AffiliationActionControlCase,
    ListAffiliationsCase,
    ProductsAffiliatesService,
  ],
  exports: [ProductsAffiliatesService],
})
export class ProductsAffiliatesModule {}
