import { TransactionsBuyers } from '@/infra/database/entities/transactions_buyers.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class TransactionBuyer {
  private readonly _id: string;
  private readonly _props: TransactionsBuyers;

  constructor(props: TransactionsBuyers) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
    this._props.visitor_id = props.visitor_id || GenerateUUID.generate();
  }

  get id(): string {
    return this._id;
  }

  get visitor_id(): string {
    return this._props.visitor_id;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get affiliate_id(): string | undefined {
    return this._props.affiliate_id;
  }

  get name(): string | undefined {
    return this._props.name;
  }

  set name(name: string | undefined) {
    this._props.name = name;
  }

  get email(): string | undefined {
    return this._props.email;
  }

  set email(email: string | undefined) {
    this._props.email = email.toLowerCase();
  }

  get phone(): string | undefined {
    return this._props.phone;
  }

  set phone(phone: string | undefined) {
    this._props.phone = phone;
  }

  get address(): TransactionsBuyers['address'] | undefined {
    return this._props.address;
  }

  set address(address: TransactionsBuyers['address'] | undefined) {
    this._props.address = address;
  }

  get document(): string | undefined {
    return this._props.document;
  }

  set document(document: string | undefined) {
    this._props.document = document;
  }

  get payment_method(): string {
    return this._props.payment_method;
  }

  set payment_method(payment_method: string) {
    this._props.payment_method = payment_method;
  }

  get transaction_id(): string | undefined {
    return this._props.transaction_id;
  }

  set transaction_id(transaction_id: string | undefined) {
    this._props.transaction_id = transaction_id;
  }

  get birth_date(): string | undefined {
    return this._props.birth_date;
  }

  set birth_date(birth_date: string | undefined) {
    this._props.birth_date = birth_date;
  }

  get utm_source(): string | undefined {
    return this._props.utm_source;
  }

  set utm_source(utm_source: string | undefined) {
    this._props.utm_source = utm_source;
  }

  get utm_campaign(): string | undefined {
    return this._props.utm_campaign;
  }

  set utm_campaign(utm_campaign: string | undefined) {
    this._props.utm_campaign = utm_campaign;
  }

  get utm_medium(): string | undefined {
    return this._props.utm_medium;
  }

  set utm_medium(utm_medium: string | undefined) {
    this._props.utm_medium = utm_medium;
  }
  get utm_term(): string | undefined {
    return this._props.utm_term;
  }

  set utm_term(utm_term: string | undefined) {
    this._props.utm_term = utm_term;
  }

  get utm_content(): string | undefined {
    return this._props.utm_content;
  }

  set utm_content(utm_content: string | undefined) {
    this._props.utm_content = utm_content;
  }

  get created_at(): Date {
    return this._props.created_at;
  }

  get updated_at(): Date {
    return this._props.updated_at;
  }

  set updated_at(updated_at: Date) {
    this._props.updated_at = updated_at;
  }

  get allProps(): TransactionsBuyers {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
