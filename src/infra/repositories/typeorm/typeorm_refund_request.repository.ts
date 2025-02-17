import { RefundRequestModel } from '@/domain/models/refund_request.model';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { RefundRequestEntity } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class TypeormRefundRequestRepository
  implements IERefundRequestRepository
{
  constructor(
    @InjectRepository(RefundRequestEntity)
    private readonly refundRequestRepository: Repository<RefundRequestEntity>,
  ) {}

  findOne(
    options: FindOneOptions<RefundRequestEntity>,
  ): Promise<RefundRequestEntity> {
    return this.refundRequestRepository.findOne(options);
  }
  findById(RefundRequestId: string): Promise<RefundRequestEntity> {
    return this.refundRequestRepository.findOne({
      where: { id: RefundRequestId },
    });
  }
  create(data: RefundRequestModel): Promise<RefundRequestEntity> {
    return this.refundRequestRepository.save(data.allProps);
  }
  update(data: RefundRequestModel): Promise<UpdateResult> {
    return this.refundRequestRepository.update(data.id, data.allProps);
  }
  findAll(
    options: FindManyOptions<RefundRequestEntity>,
  ): Promise<RefundRequestEntity[]> {
    return this.refundRequestRepository.find(options);
  }

  count(options: FindManyOptions<RefundRequestEntity>): Promise<number> {
    return this.refundRequestRepository.count(options);
  }
}
