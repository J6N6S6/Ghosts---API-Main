import { Body, Controller, Get, Post } from '@nestjs/common';
import { RefundRequestService } from '../services/refund_request.service';
import { NewRefundRequestBody } from '../validators/newRefundRequest.body';
import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('refunds')
export class RefundRequestController {
  constructor(
    private readonly refundRequestService: RefundRequestService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  @Post()
  @IsPublic()
  async createNewRefundRequest(@Body() body: NewRefundRequestBody) {
    const result = await this.refundRequestService.createNewRefundRequest(body);

    return {
      hasError: false,
      data: result,
    };
  }

  @Get('/notification')
  @IsPublic()
  async simulateNewRefundNotificatipm() {
    this.eventEmitter.emit('push_notification.send', {
      user_id: 'bb18450b-f92c-40d9-ae3b-94c5e4704aea',
      notification: {
        title: 'Venda aprovada!',
        body: `Valor: R$ 22,97`,
      },
    });
    return 'Event emitido';
  }
}
