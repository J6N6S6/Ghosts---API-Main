import { Voucher } from '@/domain/models/vouchers.model';
import { Vouchers } from '@/infra/database/entities/vouchers.entity';

export abstract class VouchersRepository {
  abstract create(data: Voucher): Promise<void>;
  abstract update(data: Voucher): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Vouchers>;
  abstract findAllByProduct(product_id: string): Promise<Vouchers[]>;
  abstract findByCodeAndProductId(
    code: string,
    product_id: string,
  ): Promise<Vouchers>;
}
