import { UserBankingTransactions } from '@/infra/database/entities/user_banking_transactions.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserBankingTransaction {
  private readonly _id: string;
  private readonly _props: UserBankingTransactions;

  constructor(props: UserBankingTransactions) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;

    // max 3 decimal places
    if (props.value) this._props.value = parseFloat(props.value.toFixed(3));
    if (props.balance)
      this._props.balance = parseFloat(props.balance.toFixed(3));
    if (props.old_balance)
      this._props.old_balance = parseFloat(props.old_balance.toFixed(3));
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

  get transaction_type(): string {
    return this._props.transaction_type;
  }

  get operation_type(): string {
    return this._props.operation_type;
  }

  get discounts(): {
    type: string;
    name: string;
    amount: number;
  }[] {
    return this._props.discounts;
  }

  get value(): number {
    return this._props.value;
  }

  get balance(): number {
    return this._props.balance;
  }

  get old_balance(): number {
    return this._props.old_balance;
  }

  get created_at(): Date {
    return this._props.created_at;
  }

  get liquidation_date(): Date | null {
    return this._props.liquidation_date;
  }

  get extra_data(): any {
    return this._props.extra_data;
  }

  get allProps(): UserBankingTransactions {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
