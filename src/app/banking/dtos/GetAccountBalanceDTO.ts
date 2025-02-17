export interface AccountBalanceReturn {
  total_balance: number;
  available_balance: number;
  reserve_amount: number;
  pending_balance: number;
  pending_withdrawals: number;
  approved_withdrawals: number;
}
