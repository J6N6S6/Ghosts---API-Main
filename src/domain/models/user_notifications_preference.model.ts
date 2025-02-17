import { UsersNotificationsPreferences } from '@/infra/database/entities';

export class UserNotificationsPreferences {
  private _props: UsersNotificationsPreferences;

  constructor(props: UsersNotificationsPreferences) {
    this._props = props;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get MAIL_INDICATION_SALE(): boolean {
    return this._props.MAIL_INDICATION_SALE;
  }

  set MAIL_INDICATION_SALE(value: boolean) {
    this._props.MAIL_INDICATION_SALE = value;
  }

  get MAIL_NEW_INDICATION(): boolean {
    return this._props.MAIL_NEW_INDICATION;
  }

  set MAIL_NEW_INDICATION(value: boolean) {
    this._props.MAIL_NEW_INDICATION = value;
  }

  get MAIL_NEW_SALE_CONFIRM(): boolean {
    return this._props.MAIL_NEW_SALE_CONFIRM;
  }

  set MAIL_NEW_SALE_CONFIRM(value: boolean) {
    this._props.MAIL_NEW_SALE_CONFIRM = value;
  }

  get MOBILE_APPROVED_SALES(): boolean {
    return this._props.MOBILE_APPROVED_SALES;
  }

  set MOBILE_APPROVED_SALES(value: boolean) {
    this._props.MOBILE_APPROVED_SALES = value;
  }

  get MOBILE_GENERATED_PIX_AND_BANK_SLIP(): boolean {
    return this._props.MOBILE_GENERATED_PIX_AND_BANK_SLIP;
  }

  set MOBILE_GENERATED_PIX_AND_BANK_SLIP(value: boolean) {
    this._props.MOBILE_GENERATED_PIX_AND_BANK_SLIP = value;
  }

  get allProps(): UsersNotificationsPreferences {
    return this._props;
  }
}
