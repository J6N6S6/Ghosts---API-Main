import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Withdrawals } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { WithdrawalsControlDTO } from './withdrawals_control.dto';

@Injectable()
export class WithdrawalsControlCase {
  constructor(private readonly withdrawalsRepository: WithdrawalsRepository) {}

  async execute({
    type = 'pending',
    items_per_page = 9,
    page = 1,
    search,
  }: WithdrawalsControlDTO) {
    const where: FindOptionsWhere<Withdrawals> = {
      status: type,
    };

    if (search) {
      where.user = [
        {
          name: ILike(`%${search}%`),
        },
        {
          email: ILike(`%${search}%`),
        },
      ];
    }
    const [withdrawals, withdrawals_count, total] = await Promise.all([
      this.withdrawalsRepository.find({
        where,
        skip: (page - 1) * items_per_page,
        take: items_per_page,
        select: {
          amount: true,
          approved_at: true,
          approved_by: true,
          bank_account: {
            bank_name: true,
            is_corporate: true,
            pix_key: true,
            pix_type: true,
          },
          createdAt: true,
          id: true,
          reason: true,
          status: true,
          user: {
            id: true,
            name: true,
            email: true,
            person_type: true,
          },
          approvedBy: {
            id: true,
            name: true,
            email: true,
          },
        },
        order:
          type === 'pending'
            ? {
                createdAt: 'asc',
              }
            : {
                approved_at: 'desc',
              },
        relations: ['user', 'approvedBy'],
      }),
      this.withdrawalsRepository.count({
        where,
      }),
      this.withdrawalsRepository.find({
        where: {
          status: type,
        },
        select: {
          id: true,
          status: true,
          amount: true,
        },
      }),
    ]);

    const withdrawals_accounts = withdrawals.map((withdraw) => {
      return {
        id: withdraw.id,
        status: withdraw.status,
        amount: withdraw.amount,
        user: {
          id: withdraw.user?.id,
          name: withdraw.user?.name,
          email: withdraw.user?.email,
        },
        approved_by: withdraw.approved_by
          ? {
              id: withdraw.approvedBy?.id,
              name: withdraw.approvedBy?.name,
              email: withdraw.approvedBy?.email,
            }
          : undefined,
        approved_at: withdraw.approved_at,
        bank_account: withdraw.bank_account,
        reason: withdraw.reason,
        createdAt: withdraw.createdAt,
      };
    });

    return {
      withdrawals: withdrawals_accounts,
      page,
      total_pages: Math.ceil(withdrawals_count / items_per_page),

      total_items: total.length,
      total_value: total.reduce((acc, cur) => acc + cur.amount, 0),
    };
  }
}
