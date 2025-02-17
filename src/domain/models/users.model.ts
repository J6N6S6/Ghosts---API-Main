import { Users } from '@/infra/database/entities/users.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class User {
  private _id: string;
  private _props: Users;

  constructor(props: Users) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
    if (!props.hash_link) {
      this._props.hash_link = GenerateUUID.generate();
    }

    if (props.email) {
      this._props.email = props.email.toLowerCase();
    }

    if (!props.createdAt) {
      this._props.createdAt = new Date();
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._props.name;
  }

  set name(value: string) {
    this._props.name = value;
  }

  get name_exibition(): string {
    return this._props.name_exibition;
  }

  set name_exibition(value: string) {
    this._props.name_exibition = value;
  }

  get email_validated(): boolean {
    return this._props.email_validated;
  }

  set email_validated(value: boolean) {
    this._props.email_validated = value;
  }

  get blocked_access(): boolean {
    return this._props.blocked_access;
  }

  set blocked_access(value: boolean) {
    this._props.blocked_access = value;
  }

  get email_hash(): string {
    return this._props.email_hash;
  }

  set email_hash(value: string) {
    this._props.email_hash = value;
  }

  get reset_password_code(): string {
    return this._props.reset_password_code;
  }

  set reset_password_code(value: string) {
    this._props.reset_password_code = value;
  }

  get reset_password_expires(): Date {
    return this._props.reset_password_expires;
  }

  set reset_password_expires(value: Date) {
    this._props.reset_password_expires = value;
  }

  get reset_password_attempts(): number {
    return this._props.reset_password_attempts;
  }

  set reset_password_attempts(value: number) {
    this._props.reset_password_attempts = value;
  }

  get reset_password_token(): string {
    return this._props.reset_password_token;
  }

  set reset_password_token(value: string) {
    this._props.reset_password_token = value;
  }

  get mfa_code(): string {
    return this._props.mfa_code;
  }

  set mfa_code(value: string) {
    this._props.mfa_code = value;
  }

  get mfa_code_expires(): Date {
    return this._props.mfa_code_expires;
  }

  set mfa_code_expires(value: Date) {
    this._props.mfa_code_expires = value;
  }

  get reset_password_token_expires(): Date {
    return this._props.reset_password_token_expires;
  }

  set reset_password_token_expires(value: Date) {
    this._props.reset_password_token_expires = value;
  }

  get email(): string {
    return this._props.email;
  }

  get password(): string {
    return this._props.password;
  }

  set password(value: string) {
    this._props.password = value;
  }

  get total_revenue(): Users['total_revenue'] {
    return this._props.total_revenue;
  }

  set total_revenue(value: Users['total_revenue']) {
    this._props.total_revenue = value;
  }

  get last_revenue_update(): Users['last_revenue_update'] {
    return this._props.last_revenue_update;
  }

  set last_revenue_update(value: Users['last_revenue_update']) {
    this._props.last_revenue_update = value;
  }

  get documentReason(): Users['documentReason'] {
    return this._props.documentReason;
  }

  set documentReason(value: Users['documentReason']) {
    this._props.documentReason = value;
  }

  get documents(): Users['documents'] {
    return this._props.documents;
  }

  set documents(value: Users['documents']) {
    this._props.documents = value;
  }

  get cpf(): string {
    return this._props.cpf;
  }

  set cpf(value: string) {
    this._props.cpf = value;
  }

  get cnpj(): string {
    return this._props.cnpj;
  }

  set cnpj(value: string) {
    this._props.cnpj = value;
  }

  get rg(): string {
    return this._props.rg;
  }

  set rg(value: string) {
    this._props.rg = value;
  }

  get tax_config(): Users['tax_config'] {
    return this._props.tax_config;
  }

  set tax_config(value: Users['tax_config']) {
    this._props.tax_config = value;
  }

  get login_attempts(): Users['login_attempts'] {
    return this._props.login_attempts;
  }

  set login_attempts(value: Users['login_attempts']) {
    this._props.login_attempts = value;
  }

  get last_login_attempt(): Users['last_login_attempt'] {
    return this._props.last_login_attempt;
  }

  set last_login_attempt(value: Users['last_login_attempt']) {
    this._props.last_login_attempt = value;
  }

  get tax_frequency(): Users['tax_frequency'] {
    return this._props.tax_frequency;
  }

  set tax_frequency(value: Users['tax_frequency']) {
    this._props.tax_frequency = value;
  }

  get photo(): string {
    return this._props.photo;
  }

  set photo(value: string) {
    this._props.photo = value;
  }

  get person_type(): Users['person_type'] {
    return this._props.person_type;
  }

  set person_type(value: Users['person_type']) {
    this._props.person_type = value;
  }

  get account_type(): Users['account_type'] {
    return this._props.account_type;
  }

  get hash_link(): string {
    return this._props.hash_link;
  }

  get phone(): string {
    return this._props.phone;
  }

  set phone(value: string) {
    this._props.phone = value;
  }

  get phone_validated(): boolean {
    return this._props.phone_validated;
  }

  set phone_validated(value: boolean) {
    this._props.phone_validated = value;
  }

  get additional_info(): Users['additional_info'] {
    return this._props.additional_info;
  }

  set additional_info(value: Users['additional_info']) {
    this._props.additional_info = value;
  }

  get indicated_by(): string {
    return this._props.indicated_by;
  }

  get address(): Users['address'] {
    return this._props.address;
  }

  set address(value: Users['address']) {
    this._props.address = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date {
    return this._props.updatedAt;
  }

  get documentStatus(): Users['documentStatus'] {
    return this._props.documentStatus;
  }

  set documentStatus(value: Users['documentStatus']) {
    this._props.documentStatus = value;
  }

  get document_approved_by(): string {
    return this._props.document_approved_by;
  }

  set document_approved_by(value: string) {
    this._props.document_approved_by = value;
  }

  get documentValidated(): Users['documentValidated'] {
    return this._props.documentValidated;
  }

  set documentValidated(value: Users['documentValidated']) {
    this._props.documentValidated = value;
  }

  get tags(): Users['tags'] {
    return this._props.tags;
  }

  set tags(value: Users['tags']) {
    this._props.tags = value;
  }

  get allProps(): Users {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
