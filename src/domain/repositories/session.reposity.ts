import { FindManyOptions, FindOneOptions, UpdateResult } from 'typeorm';
import { SessionModel } from '../models/session.model';
import { SessionEntity } from '@/infra/database/entities/session.entity';

export abstract class IESessionRepository {
  abstract create(data: SessionModel): Promise<SessionEntity>;
  abstract update(data: SessionModel): Promise<UpdateResult>;
  abstract findOne(
    options: FindOneOptions<SessionEntity>,
  ): Promise<SessionEntity>;
  abstract findById(RefundRequestId: string): Promise<SessionEntity>;
  abstract findAll(
    options: FindManyOptions<SessionEntity>,
  ): Promise<SessionEntity[]>;
  abstract count(options: FindManyOptions<SessionEntity>): Promise<number>;
}
