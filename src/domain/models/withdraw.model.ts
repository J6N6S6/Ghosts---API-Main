import { Withdrawals } from '@/infra/database/entities/withdrawals.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Withdraw {
  private _id: string;
  private _props: Withdrawals;

  constructor(props: Withdrawals) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get amount(): number {
    return this._props.amount;
  }

  get status(): string {
    return this._props.status;
  }

  set status(value: string) {
    this._props.status = value;
  }

  get reason(): string | undefined {
    return this._props.reason;
  }

  set reason(value: string | undefined) {
    this._props.reason = value;
  }

  get transaction_id(): string {
    return this._props.transaction_id;
  }

  set transaction_id(value: string) {
    this._props.transaction_id = value;
  }

  get approved_by(): string | undefined {
    return this._props.approved_by;
  }

  set approved_by(value: string | undefined) {
    this._props.approved_by = value;
  }

  get bank_account(): Withdrawals['bank_account'] {
    return this._props.bank_account;
  }

  set bank_account(value: Withdrawals['bank_account']) {
    this._props.bank_account = value;
  }

  get approved_at(): Date | undefined {
    return this._props.approved_at;
  }

  set approved_at(value: Date | undefined) {
    this._props.approved_at = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  get allProps(): Withdrawals {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
