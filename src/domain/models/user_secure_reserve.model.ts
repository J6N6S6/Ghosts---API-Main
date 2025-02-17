import { UserSecureReserveTransactionsEntity } from '@/infra/database/entities/user_secure_reserve_transactions.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserBankingSecureReserveModel {
  private readonly _id: string;
  private readonly _props: UserSecureReserveTransactionsEntity;

  constructor(props: UserSecureReserveTransactionsEntity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;

    // max 3 decimal places
    if (props.value) this._props.value = parseFloat(props.value.toFixed(3));
    if (props.total_amount_reserved)
      this._props.total_amount_reserved = parseFloat(
        props.total_amount_reserved.toFixed(3),
      );
    if (props.old_total_amount_reserved)
      this._props.old_total_amount_reserved = parseFloat(
        props.old_total_amount_reserved.toFixed(3),
      );
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get original_transaction_id(): string {
    return this._props.original_transaction_id;
  }

  get reference_id(): string {
    return this._props.reference_id;
  }

  get status(): string {
    return this._props.status;
  }

  get value(): number {
    return this._props.value;
  }

  get operation_type(): string {
    return this._props.operation_type;
  }

  get created_at(): Date {
    return this._props.created_at;
  }

  get liquidation_date(): Date | null {
    return this._props.liquidation_date;
  }

  get allProps(): UserSecureReserveTransactionsEntity {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
