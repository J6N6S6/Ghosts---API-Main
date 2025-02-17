import { CoProducer } from '@/domain/models/co_producer.model';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { CoProducers } from '@/infra/database/entities/co_producers.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TypeormCoProducersRepository implements CoProducersRepository {
  constructor(
    @InjectRepository(CoProducers)
    private readonly coProducersRepository: Repository<CoProducers>,
  ) {}

  findById(id: string): Promise<CoProducers> {
    return this.coProducersRepository.findOneBy({ id });
  }

  findByProductId(user_id: string): Promise<CoProducers[]> {
    return this.coProducersRepository.findBy({
      user_id,
    });
  }

  create(data: CoProducer): Promise<CoProducers> {
    return this.coProducersRepository.save(data.allProps);
  }

  async update(data: CoProducer): Promise<void> {
    await this.coProducersRepository.update(data.id, data.allProps);
  }

  findBy(where: FindOptionsWhere<CoProducers>): Promise<CoProducers> {
    return this.coProducersRepository.findOneBy(where);
  }

  findManyBy(where: FindOptionsWhere<CoProducers>): Promise<CoProducers[]> {
    return this.coProducersRepository.find({
      where,
    });
  }

  find(options: FindManyOptions<CoProducers>): Promise<CoProducers[]> {
    return this.coProducersRepository.find(options);
  }

  async deleteById(id: string): Promise<void> {
    await this.coProducersRepository.delete({
      id,
    });
  }
}
