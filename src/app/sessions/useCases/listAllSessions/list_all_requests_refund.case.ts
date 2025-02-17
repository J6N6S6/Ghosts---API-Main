import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { IESessionRepository } from '@/domain/repositories/session.reposity';
import { RefundRequestEntity } from '@/infra/database/entities';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class ListAllSessionsCase {
  constructor(private readonly sessionsRepository: IESessionRepository) {}

  async execute({
    page = 1,

    limit = 10,
    search,
  }: any) {
    let where:
      | FindOptionsWhere<RefundRequestEntity>
      | FindOptionsWhere<RefundRequestEntity>[] = {};

    if (search) {
      where = [
        { ...where, transaction_id: ILike(`%${search}%`) },
        { ...where, buyer_document: ILike(`%${search}%`) },
        { ...where, buyer_name: ILike(`%${search}%`) },
        { ...where, pix_key: ILike(`%${search}%`) },
      ];
    }

    const [sessions, total_items] = await Promise.all([
      this.sessionsRepository.findAll({
        where,

        order: {
          created_at: 'desc',
        },
        ...Pagination(page, limit),
      }),
      this.sessionsRepository.count({ where }),
    ]);

    return {
      data: sessions,
      total_items,
      page: page,
      total_pages: Math.ceil(total_items / limit),
    };
  }
}
