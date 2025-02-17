import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { CoProducersController } from './controllers/co_producers.controller';
import { CoProducersService } from './services/co_producers.service';
import { AcceptInviteCoProducerCase } from './useCases/accept-invite-co-producer/accept_invite_co_producer';
import { InviteCoProducerCase } from './useCases/invite-co-producer/invite_co_producer.case';
import { ListProductCoProducersCase } from './useCases/list-product-co-producers/list_product_co_producers.case';
import { RemoveCoProducerCase } from './useCases/remove-co-producer/remove_co_producer.case';
import { UpdateCoProducerCase } from './useCases/update-co-producer/update_co_producer';

@Module({
  imports: [InfraModule, ProductsModule],
  providers: [
    InviteCoProducerCase,
    AcceptInviteCoProducerCase,
    ListProductCoProducersCase,
    CoProducersService,
    UpdateCoProducerCase,
    RemoveCoProducerCase,
  ],
  controllers: [CoProducersController],
  exports: [CoProducersService],
})
export class CoProducersModule {}
