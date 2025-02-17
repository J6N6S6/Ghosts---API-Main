import { UserBankingAccounts } from '@/infra/database/entities/user_banking_accounts.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserBankingAccount {
  private readonly _id: string;
  private readonly _props: UserBankingAccounts;

  constructor(props: UserBankingAccounts) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get is_corporate(): boolean {
    return this._props.is_corporate;
  }

  set is_corporate(value: boolean) {
    this._props.is_corporate = value;
  }

  get pix_key(): string {
    return this._props.pix_key;
  }

  set pix_key(value: string) {
    this._props.pix_key = value;
  }

  get pix_type(): string {
    return this._props.pix_type;
  }

  set pix_type(value: string) {
    this._props.pix_type = value;
  }

  get bank_agency(): string {
    return this._props.bank_agency;
  }

  set bank_agency(value: string) {
    this._props.bank_agency = value;
  }

  get bank_account(): string {
    return this._props.bank_account;
  }

  set bank_account(value: string) {
    this._props.bank_account = value;
  }

  get bank_account_type(): 'CC' | 'CP' {
    return this._props.bank_account_type;
  }

  set bank_account_type(value: 'CC' | 'CP') {
    this._props.bank_account_type = value;
  }

  get name(): string | undefined {
    return this._props.name;
  }

  set name(value: string | undefined) {
    this._props.name = value;
  }

  get bank_name(): string | undefined {
    return this._props.bank_name;
  }

  set bank_name(value: string | undefined) {
    this._props.bank_name = value;
  }

  get additional_data(): object | any {
    return this._props.additional_data;
  }

  set additional_data(value: object | any) {
    this._props.additional_data = value;
  }

  get created_at(): Date {
    return this._props.created_at;
  }

  get updated_at(): Date {
    return this._props.updated_at;
  }

  get allProps(): UserBankingAccounts {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
