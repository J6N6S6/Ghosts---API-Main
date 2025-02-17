import { Vouchers } from '@/infra/database/entities/vouchers.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';
import { VouchersDiscountType } from '@/shared/@types/vouchers/vouchers.type';

export class Voucher {
  private readonly _id: string;
  private readonly _props: Vouchers;

  constructor(props: Vouchers) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get code(): string {
    return this._props.code;
  }

  set code(value: string) {
    this._props.code = value;
  }

  get discount_type(): VouchersDiscountType {
    return this._props.discount_type;
  }

  set discount_type(value: VouchersDiscountType) {
    this._props.discount_type = value;
  }

  get discount(): number {
    return this._props.discount;
  }

  set discount(value: number) {
    this._props.discount = value;
  }

  get deadline(): Date | null {
    return this._props.deadline;
  }

  set deadline(value: Date | null) {
    this._props.deadline = value;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  get updatedAt(): Date | null {
    return this._props.updatedAt;
  }

  set updatedAt(value: Date) {
    this._props.updatedAt = value;
  }
}
