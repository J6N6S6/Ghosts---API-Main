import { RefundRequestModel } from '../models/refund_request.model';
import { RefundRequestEntity } from './../../infra/database/entities/refund_request.entity';

import { FindManyOptions, FindOneOptions, UpdateResult } from 'typeorm';

export abstract class IERefundRequestRepository {
  abstract create(data: RefundRequestModel): Promise<RefundRequestEntity>;
  abstract update(data: RefundRequestModel): Promise<UpdateResult>;
  abstract findOne(
    options: FindOneOptions<RefundRequestEntity>,
  ): Promise<RefundRequestEntity>;
  abstract findById(RefundRequestId: string): Promise<RefundRequestEntity>;
  abstract findAll(
    options: FindManyOptions<RefundRequestEntity>,
  ): Promise<RefundRequestEntity[]>;
  abstract count(
    options: FindManyOptions<RefundRequestEntity>,
  ): Promise<number>;
}
