export interface SaqPayIpnDto {
  external_reference: string;
  transaction_id: string;
  ipn_secret: string;
  ipn_event: string;
  correlation_id: string;
}
