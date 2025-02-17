import { RefundRequestEntity } from '@/infra/database/entities/refund_request.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class RefundRequestModel {
  private readonly _id: string;
  private readonly _props: RefundRequestEntity;
  constructor(props: RefundRequestEntity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get buyer_name(): string {
    return this._props.buyer_name;
  }

  get transaction_email(): string {
    return this._props.transaction_email;
  }

  get buyer_document(): string {
    return this._props.buyer_document;
  }

  get buyer_phone(): string {
    return this._props.buyer_phone;
  }

  get pix_key(): string {
    return this._props.pix_key;
  }

  get transaction_id(): string {
    return this._props.transaction_id;
  }

  get reason(): string {
    return this._props.reason;
  }

  get status():
    | 'CONCLUDED'
    | 'WAITING_REFUND_PAYMENT'
    | 'PENDING'
    | 'REJECTED' {
    return this._props.status;
  }

  set status(
    status: 'CONCLUDED' | 'WAITING_REFUND_PAYMENT' | 'PENDING' | 'REJECTED',
  ) {
    this._props.status = status;
  }

  get allProps(): RefundRequestEntity {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
