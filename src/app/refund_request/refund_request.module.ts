import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { RefundRequestController } from './controllers/refund_request.controller';
import { RefundRequestService } from './services/refund_request.service';
import { CreateNewRefundRequestCase } from './useCases/createNewRequestRefund/createNewRequestRefund.case';

import { AuthModule } from '../auth/auth.module';
import { IpnModule } from '../ipn/ipn.module';
import { AuthorizedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/authorized_payment.case';
import { DisputeAcceptedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/dispute_accepted_payment.case';
import { DisputeRejectedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/dispute_rejected_payment.case';
import { InDisputePaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/in_dispute_payment.case';
import { AdminRefundRequestController } from './controllers/admin.refund_request.controller';
import { ApproveRefundCase } from './useCases/approveRefund/approve_refund.case';
import { ConfirmPaymentManualCase } from './useCases/confirmPaymentManual/confirm_payment_manual.case';
import { ListAllRequestsRefundCase } from './useCases/listAllRequestsRefund/list_all_requests_refund.case';
import { RejectRefundCase } from './useCases/rejectRefund/reject_refund.case';
import { RefundManualCase } from './useCases/refundManual/refundManualCase';
import { RefundedPaymentCase } from '../ipn/useCases/create-transaction-ipn/useCases/refunded_payment.case copy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RefundAutomaticWithFirebankingCase } from './useCases/refundAutomaticWithFirebanking/refund_automatic_with_firebanking.case';

@Module({
  imports: [
    InfraModule,
    IpnModule,
    AuthModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: '',
        };
      },
    }),
  ],
  providers: [
    RefundRequestService,
    CreateNewRefundRequestCase,
    ListAllRequestsRefundCase,
    ApproveRefundCase,
    RejectRefundCase,
    ConfirmPaymentManualCase,
    InDisputePaymentCase,
    AuthorizedPaymentCase,
    DisputeAcceptedPaymentCase,
    DisputeRejectedPaymentCase,
    RefundManualCase,
    RefundedPaymentCase,
    RefundAutomaticWithFirebankingCase,
  ],
  controllers: [RefundRequestController, AdminRefundRequestController],
})
export class RefundRequestModule {}
