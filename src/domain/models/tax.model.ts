import { Taxes } from '@/infra/database/entities/taxes.entity';

export class Tax {
  private readonly _id: string;
  private _props: Taxes;

  constructor(props: Taxes) {
    this._id = props.id;
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get withdrawal_fee(): Taxes['withdrawal_fee'] {
    return this._props.withdrawal_fee;
  }

  set withdrawal_fee(value: Taxes['withdrawal_fee']) {
    this._props.withdrawal_fee = value;
  }

  get security_reserve_fee(): Taxes['security_reserve_fee'] {
    return this._props.security_reserve_fee;
  }

  set security_reserve_fee(value: Taxes['security_reserve_fee']) {
    this._props.security_reserve_fee = value;
  }

  get payment_fee(): Taxes['payment_fee'] {
    return this._props.payment_fee;
  }

  set payment_fee(value: Taxes['payment_fee']) {
    this._props.payment_fee = value;
  }

  get secure_reserve_config(): Taxes['secure_reserve_config'] {
    return this._props.secure_reserve_config;
  }

  set secure_reserve_config(value: Taxes['secure_reserve_config']) {
    this._props.secure_reserve_config = value;
  }

  get allProps(): Taxes {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
