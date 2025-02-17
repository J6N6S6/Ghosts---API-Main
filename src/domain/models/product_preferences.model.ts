import { Products } from '@/infra/database/entities/products.entity';
import { ProductsPreferences } from '@/infra/database/entities/products_preferences.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class ProductPreferences {
  private _id: string;
  private _props: ProductsPreferences;

  constructor(props: ProductsPreferences) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get payment_method(): string[] {
    return this._props.payment_method;
  }

  set payment_method(payment_method: string[]) {
    this._props.payment_method = payment_method;
  }

  get orderbumps(): ProductsPreferences['orderbumps'] {
    return this._props.orderbumps;
  }

  set orderbumps(orderbumps: ProductsPreferences['orderbumps']) {
    this._props.orderbumps = orderbumps;
  }

  get allow_payment_with_two_cards(): boolean {
    return this._props.allow_payment_with_two_cards;
  }

  set allow_payment_with_two_cards(allow_payment_with_two_cards: boolean) {
    this._props.allow_payment_with_two_cards = allow_payment_with_two_cards;
  }

  get repeat_email_in_checkout(): boolean {
    return this._props.repeat_email_in_checkout;
  }

  set repeat_email_in_checkout(repeat_email_in_checkout: boolean) {
    this._props.repeat_email_in_checkout = repeat_email_in_checkout;
  }

  get inputs_checkout(): ProductsPreferences['inputs_checkout'] {
    return this._props.inputs_checkout;
  }

  set inputs_checkout(inputs_checkout: ProductsPreferences['inputs_checkout']) {
    this._props.inputs_checkout = inputs_checkout;
  }

  get color_section(): string | null {
    return this._props.color_section;
  }

  set color_section(color_section: string | null) {
    this._props.color_section = color_section;
  }

  get upsell_url(): string | null {
    return this._props.upsell_url;
  }

  set upsell_url(upsell_url: string | null) {
    this._props.upsell_url = upsell_url;
  }

  get whatsapp_link(): string | null {
    return this._props.whatsapp_link;
  }

  set whatsapp_link(whatsapp_link: string | null) {
    this._props.whatsapp_link = whatsapp_link;
  }

  get notifications(): ProductsPreferences['notifications'] {
    return this._props.notifications;
  }

  set notifications(notifications: ProductsPreferences['notifications']) {
    this._props.notifications = notifications;
  }

  get countdown(): ProductsPreferences['countdown'] {
    return this._props.countdown;
  }

  set countdown(countdown: ProductsPreferences['countdown']) {
    this._props.countdown = countdown;
  }

  get purchase_button(): ProductsPreferences['purchase_button'] {
    return this._props.purchase_button;
  }

  set purchase_button(purchase_button: ProductsPreferences['purchase_button']) {
    this._props.purchase_button = purchase_button;
  }

  get product(): Products {
    return this._props.product;
  }

  get back_redirect_url(): string {
    return this._props.back_redirect_url;
  }

  set back_redirect_url(back_redirect_url: string) {
    this._props.back_redirect_url = back_redirect_url;
  }

  get allProps(): ProductsPreferences {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
