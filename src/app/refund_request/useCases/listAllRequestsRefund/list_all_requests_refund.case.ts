import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { RefundRequestEntity } from '@/infra/database/entities';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ListAllRequestsRefundDTO } from './list_all_requests_refunds.dto';

@Injectable()
export class ListAllRequestsRefundCase {
  constructor(
    private readonly refundRequestRepository: IERefundRequestRepository,
  ) {}

  async execute({
    page = 1,
    status,
    limit = 10,
    search,
  }: ListAllRequestsRefundDTO) {
    let where:
      | FindOptionsWhere<RefundRequestEntity>
      | FindOptionsWhere<RefundRequestEntity>[] = {};

    if (status) {
      where['status'] = status;
    }

    if (search) {
      where = [
        { ...where, transaction_id: ILike(`%${search}%`) },
        { ...where, buyer_document: ILike(`%${search}%`) },
        { ...where, buyer_name: ILike(`%${search}%`) },
        { ...where, pix_key: ILike(`%${search}%`) },
      ];
    }

    const [request_refunds, total_items] = await Promise.all([
      this.refundRequestRepository.findAll({
        where,
        relations: ['transaction', 'transaction.product'],
        select: {
          transaction: {
            id: true,
            transaction_amount: true,
            status: true,
            product: {
              id: true,
              title: true,
            },
          },
        },
        order: {
          created_at: 'desc',
        },
        ...Pagination(page, limit),
      }),
      this.refundRequestRepository.count({ where }),
    ]);

    return {
      data: request_refunds,
      total_items,
      page: page,
      total_pages: Math.ceil(total_items / limit),
    };
  }
}
