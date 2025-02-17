import { ListAllSessionsCase } from './useCases/listAllSessions/list_all_requests_refund.case';
import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { IpnModule } from '../ipn/ipn.module';
import { AuthorizedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/authorized_payment.case';
import { DisputeAcceptedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/dispute_accepted_payment.case';
import { DisputeRejectedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/dispute_rejected_payment.case';
import { InDisputePaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { AdminRefundRequestController } from './controllers/admin.refund_request.controller';

import { RejectRefundCase } from './useCases/rejectRefund/reject_refund.case';
import { RefundManualCase } from './useCases/refundManual/refundManualCase';
import { CreateNewSessionCase } from './useCases/createNewSessionCase/createNewSession';
import { SessionService } from './services/session.service';

@Module({
  imports: [InfraModule, IpnModule, AuthModule],
  providers: [
    SessionService,

    ListAllSessionsCase,

    RejectRefundCase,

    InDisputePaymentCase,
    AuthorizedPaymentCase,
    DisputeAcceptedPaymentCase,
    DisputeRejectedPaymentCase,
    RefundManualCase,
    CreateNewSessionCase,
  ],
  controllers: [AdminRefundRequestController],
})
export class SessionsModule {}
