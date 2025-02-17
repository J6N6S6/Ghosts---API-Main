import { Products } from '@/infra/database/entities/products.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class Product {
  private _id: string;
  private _props: Products;

  constructor(props: Products) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get status(): Products['status'] {
    return this._props.status;
  }

  set status(status: Products['status']) {
    this._props.status = status;
  }

  get status_reason(): Products['status_reason'] {
    return this._props.status_reason;
  }

  set status_reason(status_reason: Products['status_reason']) {
    this._props.status_reason = status_reason;
  }

  get title(): string {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
  }

  get price(): number {
    return this._props.price;
  }

  set price(price: number) {
    this._props.price = price;
  }

  get description(): string {
    return this._props.description;
  }

  set description(description: string) {
    this._props.description = description;
  }

  get gateway(): Products['gateway'] {
    return this._props.gateway;
  }

  set gateway(gateway: Products['gateway']) {
    this._props.gateway = gateway;
  }
  get category_id(): string {
    return this._props.category_id;
  }

  set category_id(category_id: string) {
    this._props.category_id = category_id;
  }

  get owner_id(): string {
    return this._props.owner_id;
  }

  get image(): string {
    return this._props.image;
  }

  set image(image: string) {
    this._props.image = image;
  }

  get primary_banner(): string {
    return this._props.primary_banner;
  }

  set primary_banner(primary_banner: string) {
    this._props.primary_banner = primary_banner;
  }

  get secondary_banner(): string {
    return this._props.secondary_banner;
  }

  set secondary_banner(secondary_banner: string) {
    this._props.secondary_banner = secondary_banner;
  }

  get currency(): string {
    return this._props.currency;
  }

  get sale_disabled(): boolean {
    return this._props.sale_disabled;
  }

  set sale_disabled(sale_disabled: boolean) {
    this._props.sale_disabled = sale_disabled;
  }

  get members_area(): Products['members_area'] {
    return this._props.members_area;
  }

  set members_area(members_area: Products['members_area']) {
    this._props.members_area = members_area;
  }

  get sectionsId(): number {
    return this._props.sectionsId;
  }

  get package_id(): string {
    return this._props.package_id;
  }

  set package_id(package_id: string) {
    this._props.package_id = package_id;
  }

  get section_id(): string {
    return this._props.section_id;
  }

  set section_id(section_id: string) {
    this._props.section_id = section_id;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  get payment_type(): Products['payment_type'] {
    return this._props.payment_type;
  }

  set payment_type(payment_type: Products['payment_type']) {
    this._props.payment_type = payment_type;
  }

  get product_type(): Products['product_type'] {
    return this._props.product_type;
  }

  get producer_name(): Products['producer_name'] {
    return this._props.producer_name;
  }

  set producer_name(producer_name: Products['producer_name']) {
    this._props.producer_name = producer_name;
  }

  get product_website(): Products['product_website'] {
    return this._props.product_website;
  }

  set product_website(product_website: Products['product_website']) {
    this._props.product_website = product_website;
  }

  get support_email(): Products['support_email'] {
    return this._props.support_email;
  }

  set support_email(support_email: Products['support_email']) {
    this._props.support_email = support_email;
  }

  get support_phone(): Products['support_phone'] {
    return this._props.support_phone;
  }

  set support_phone(support_phone: Products['support_phone']) {
    this._props.support_phone = support_phone;
  }

  get preferences(): Products['preferences'] {
    return this._props.preferences;
  }

  set preferences(preferences: Products['preferences']) {
    this._props.preferences = preferences;
  }

  get allow_affiliate(): Products['allow_affiliate'] {
    return this._props.allow_affiliate;
  }

  set allow_affiliate(allow_affiliate: Products['allow_affiliate']) {
    this._props.allow_affiliate = allow_affiliate;
  }

  get affiliate_commission(): Products['affiliate_commission'] {
    return this._props.affiliate_commission;
  }

  set affiliate_commission(
    affiliate_commission: Products['affiliate_commission'],
  ) {
    this._props.affiliate_commission = affiliate_commission;
  }

  get affiliate_commission_orderbump(): Products['affiliate_commission_orderbump'] {
    return this._props.affiliate_commission_orderbump;
  }

  set affiliate_commission_orderbump(
    affiliate_commission_orderbump: Products['affiliate_commission_orderbump'],
  ) {
    this._props.affiliate_commission_orderbump = affiliate_commission_orderbump;
  }

  get affiliate_automatically_approve(): Products['affiliate_automatically_approve'] {
    return this._props.affiliate_automatically_approve;
  }

  set affiliate_automatically_approve(
    affiliate_automatically_approve: Products['affiliate_automatically_approve'],
  ) {
    this._props.affiliate_automatically_approve =
      affiliate_automatically_approve;
  }

  get affiliate_receive_mail(): Products['affiliate_receive_mail'] {
    return this._props.affiliate_receive_mail;
  }

  set affiliate_receive_mail(
    affiliate_receive_mail: Products['affiliate_receive_mail'],
  ) {
    this._props.affiliate_receive_mail = affiliate_receive_mail;
  }

  get affiliate_assignment(): Products['affiliate_assignment'] {
    return this._props.affiliate_assignment;
  }

  set affiliate_assignment(
    affiliate_assignment: Products['affiliate_assignment'],
  ) {
    this._props.affiliate_assignment = affiliate_assignment;
  }

  get allow_marketplace(): Products['allow_marketplace'] {
    return this._props.allow_marketplace;
  }

  set allow_marketplace(allow_marketplace: Products['allow_marketplace']) {
    this._props.allow_marketplace = allow_marketplace;
  }

  get marketplace_support_email(): Products['marketplace_support_email'] {
    return this._props.marketplace_support_email;
  }

  set marketplace_support_email(
    marketplace_support_email: Products['marketplace_support_email'],
  ) {
    this._props.marketplace_support_email = marketplace_support_email;
  }

  get marketplace_description(): Products['marketplace_description'] {
    return this._props.marketplace_description;
  }

  set marketplace_description(
    marketplace_description: Products['marketplace_description'],
  ) {
    this._props.marketplace_description = marketplace_description;
  }

  get marketplace_checkout_link(): Products['marketplace_checkout_link'] {
    return this._props.marketplace_checkout_link;
  }

  set marketplace_checkout_link(
    marketplace_checkout_link: Products['marketplace_checkout_link'],
  ) {
    this._props.marketplace_checkout_link = marketplace_checkout_link;
  }

  get allProps(): Products {
    return {
      id: this._id,
      ...this._props,
    };
  }
}
