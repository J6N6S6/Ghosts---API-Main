import { CoProducer } from '@/domain/models/co_producer.model';
import { CoProducers } from '@/infra/database/entities/co_producers.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export abstract class CoProducersRepository {
  abstract create(coProducer: CoProducer): Promise<CoProducers>;
  abstract update(coProducer: CoProducer): Promise<void>;
  abstract findById(id: string): Promise<CoProducers>;
  abstract findByProductId(productId: string): Promise<CoProducers[]>;
  abstract findBy(where: FindOptionsWhere<CoProducers>): Promise<CoProducers>;
  abstract findManyBy(
    where: FindOptionsWhere<CoProducers>,
  ): Promise<CoProducers[]>;
  abstract find(options: FindManyOptions<CoProducers>): Promise<CoProducers[]>;
  abstract deleteById(id: string): Promise<void>;
}
