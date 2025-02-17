import { RefundRequestStatus } from '../../dtos/RefundRequestDTO';

export interface ListAllRequestsRefundDTO {
  status: RefundRequestStatus;
  page: number;
  limit: number;
  search?: string;
}
