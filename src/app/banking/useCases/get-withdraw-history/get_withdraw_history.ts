import { ClientException } from '@/infra/exception/client.exception';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetWithdrawHistoryCase {
  constructor(private readonly withdrawalsRepository: WithdrawalsRepository) {}

  async execute({
    user_id,
    page,
  }: {
    user_id: string;
    page: number;
  }): Promise<any> {
    try {
      const [withdraws, total] = await Promise.all([
        this.withdrawalsRepository.find({
          where: { user_id },
          skip: (page - 1) * 10,
          take: 10,
          order: { createdAt: 'DESC' },
          select: {
            id: true,
            status: true,
            amount: true,
            approved_at: true,
            createdAt: true,
            bank_account: {
              bank_name: true,
              is_corporate: true,
              pix_key: true,
              pix_type: true,
            },
            reason: true,
          },
        }),
        this.withdrawalsRepository.count({
          where: { user_id },
        }),
      ]);

      return {
        total_items: total,
        total_pages: Math.ceil(total / 10),
        current_page: page,
        items: withdraws,
      };
    } catch (err) {
      throw new ClientException(err.message);
    }
  }
}
