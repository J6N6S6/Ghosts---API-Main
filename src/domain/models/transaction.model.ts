import { Transactions } from '@/infra/database/entities/transactions.entity';

export class Transaction {
  private readonly _id: string;
  private readonly _props: Transactions;

  constructor(props: Transactions) {
    this._id = props.id;
    this._props = props;

    if (props.id) {
      this._props.date_last_updated = new Date();
    }
  }

  get id(): string {
    return this._id;
  }

  get seller(): Transactions['seller'] {
    return this._props.seller;
  }

  get buyer(): Transactions['buyer'] {
    return this._props.buyer;
  }

  get product(): Transactions['product'] {
    return this._props.product;
  }

  get seller_id(): string {
    return this._props.seller_id;
  }

  get external_id(): string {
    return this._props.external_id;
  }

  set external_id(external_id: string) {
    this._props.external_id = external_id;
  }

  get gateway(): string {
    return this._props.gateway;
  }

  set gateway(gateway: string) {
    this._props.gateway = gateway;
  }

  get payment_method(): string {
    return this._props.payment_method;
  }

  get status(): string {
    return this._props.status;
  }

  set status(status: string) {
    this._props.status = status;
  }

  get product_id(): string {
    return this._props.product_id;
  }

  get product_link(): string {
    return this._props.product_link;
  }

  set product_link(product_link: string) {
    this._props.product_link = product_link;
  }

  get additional_products(): {
    product_id: string;
    unit_price: number;
  }[] {
    return this._props.additional_products;
  }

  get payer(): Transactions['payer'] {
    return this._props.payer;
  }

  set payer(payer: Transactions['payer']) {
    this._props.payer = payer;
  }

  get metadata(): Transactions['metadata'] {
    return this._props.metadata;
  }

  set metadata(metadata: Transactions['metadata']) {
    this._props.metadata = metadata;
  }

  get additional_info(): Transactions['additional_info'] {
    return this._props.additional_info;
  }

  set additional_info(additional_info: Transactions['additional_info']) {
    this._props.additional_info = additional_info;
  }

  get transaction_amount(): number {
    return this._props.transaction_amount;
  }

  get transaction_amount_refunded(): number {
    return this._props.transaction_amount_refunded;
  }

  set transaction_amount_refunded(transaction_amount_refunded: number) {
    this._props.transaction_amount_refunded = transaction_amount_refunded;
  }

  get transaction_details(): Transactions['transaction_details'] {
    return this._props.transaction_details;
  }

  set transaction_details(
    transaction_details: Transactions['transaction_details'],
  ) {
    this._props.transaction_details = transaction_details;
  }

  get payment_method_details(): Transactions['payment_method_details'] {
    return this._props.payment_method_details;
  }

  set payment_method_details(
    payment_method_details: Transactions['payment_method_details'],
  ) {
    this._props.payment_method_details = payment_method_details;
  }

  get card(): Transactions['card'] {
    return this._props.card;
  }

  set card(card: Transactions['card']) {
    this._props.card = card;
  }

  get buyer_id(): string {
    return this._props.buyer_id;
  }

  get split_accounts(): Transactions['split_accounts'] {
    return this._props.split_accounts;
  }

  set split_accounts(split_accounts: Transactions['split_accounts']) {
    this._props.split_accounts = split_accounts;
  }

  get date_created(): Date {
    return this._props.date_created;
  }

  get date_last_updated(): Date {
    return this._props.date_last_updated;
  }

  get date_approved() {
    return this._props.date_approved;
  }

  set date_approved(date_approved: Date) {
    this._props.date_approved = date_approved;
  }

  get forced_status(): boolean {
    return this._props.forced_status;
  }

  set forced_status(forced_status: boolean) {
    this._props.forced_status = forced_status;
  }

  get allProps(): Transactions {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
