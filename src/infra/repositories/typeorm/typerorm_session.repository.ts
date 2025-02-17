import { SessionModel } from '@/domain/models/session.model';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { IESessionRepository } from '@/domain/repositories/session.reposity';

import { SessionEntity } from '@/infra/database/entities/session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class TypeormSessionRepository implements IESessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  findOne(options: FindOneOptions<SessionEntity>): Promise<SessionEntity> {
    return this.sessionRepository.findOne(options);
  }
  findById(RefundRequestId: string): Promise<SessionEntity> {
    return this.sessionRepository.findOne({
      where: { id: RefundRequestId },
    });
  }
  create(data: SessionModel): Promise<SessionEntity> {
    return this.sessionRepository.save(data.allProps);
  }
  update(data: SessionModel): Promise<UpdateResult> {
    return this.sessionRepository.update(data.id, data.allProps);
  }
  findAll(options: FindManyOptions<SessionEntity>): Promise<SessionEntity[]> {
    return this.sessionRepository.find(options);
  }

  count(options: FindManyOptions<SessionEntity>): Promise<number> {
    return this.sessionRepository.count(options);
  }
}
