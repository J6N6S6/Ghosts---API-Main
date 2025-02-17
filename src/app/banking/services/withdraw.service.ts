import { Injectable } from '@nestjs/common';
import { ApproveWithdrawCase } from '../useCases/approve-withdraw/approve_withdraw.case';
import { ApproveWithdrawDTO } from '../useCases/approve-withdraw/approve_withdraw.dto';
import { DeclineWithdrawCase } from '../useCases/decline-withdraw/decline_withdraw.case';
import { DeclineWithdrawDTO } from '../useCases/decline-withdraw/decline_withdraw.dto';
import { GetWithdrawHistoryCase } from '../useCases/get-withdraw-history/get_withdraw_history';
import { RequestWithdrawCase } from '../useCases/request-withdraw/request_withdraw.case';
import { RequestWithdrawDTO } from '../useCases/request-withdraw/request_withdraw.dto';
import { WithdrawalsControlMetricsCase } from '../useCases/withdrawals-control-metrics/withdrawals_control_metrics.case';
import { WithdrawalsControlMetricsDTO } from '../useCases/withdrawals-control-metrics/withdrawals_control_metrics.dto';
import { WithdrawalsControlCase } from '../useCases/withdrawals-control/withdrawals_control.case';
import { WithdrawalsControlDTO } from '../useCases/withdrawals-control/withdrawals_control.dto';
import { WithdrawalsSecretCase } from '../useCases/withdrawals-secret/withdrawals_secret.case';
import { ApproveAutomaticWithdrawCase } from '../useCases/approve-automatic-withdraw/approve_automatic_withdraw.case';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly requestWithdrawCase: RequestWithdrawCase,
    private readonly withdrawalsControlCase: WithdrawalsControlCase,
    private readonly approveWithdrawCase: ApproveWithdrawCase,
    private readonly declineWithdrawCase: DeclineWithdrawCase,
    private readonly getWithdrawHistoryCase: GetWithdrawHistoryCase,
    private readonly withdrawalsSecretCase: WithdrawalsSecretCase,
    private readonly withdrawalsControlMetricsCase: WithdrawalsControlMetricsCase,
    private readonly approveAutomaticWithdrawCase: ApproveAutomaticWithdrawCase,
  ) {}

  async requestWithdraw(data: RequestWithdrawDTO): Promise<any> {
    return this.requestWithdrawCase.execute(data);
  }

  async listWithdrawalsControl(data: WithdrawalsControlDTO): Promise<any> {
    return this.withdrawalsControlCase.execute(data);
  }

  async approveWithdraw(data: ApproveWithdrawDTO) {
    return this.approveWithdrawCase.execute(data);
  }

  async approveAutomaticWithdraw(data: ApproveWithdrawDTO) {
    return this.approveAutomaticWithdrawCase.execute(data);
  }

  async declineWithdraw(data: DeclineWithdrawDTO) {
    return this.declineWithdrawCase.execute(data);
  }

  async getWithdrawHistory(data: { user_id: string; page: number }) {
    return this.getWithdrawHistoryCase.execute(data);
  }

  async listSecretWithdrawals() {
    return this.withdrawalsSecretCase.execute();
  }

  async getWithdrawalsControlMetrics(data: WithdrawalsControlMetricsDTO) {
    return this.withdrawalsControlMetricsCase.execute(data);
  }
}
