import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { CreatePaymentBody } from '../validators/create_payment.body';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottleExceptionFilter } from '../excepetions/CustomThrottleExceptionFilter';
import { CustomThrottlerGuard } from '../guards/CustomThrottleGuard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('payment/status/:id')
  @IsPublic()
  async getPaymentStatus(@Param('id') order_id: string) {
    const status = await this.checkoutService.getPaymentStatus(order_id);

    return {
      hasError: false,
      data: status,
    };
  }

  @Post('payment')
  @IsPublic()
  @UseGuards(CustomThrottlerGuard)
  @UseFilters(CustomThrottleExceptionFilter)
  async checkout(@Body() data: CreatePaymentBody, @Req() request: Request) {
    const clientIp =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    // Obter o User-Agent
    const userAgent = request.headers['user-agent'];

    const payment = await this.checkoutService.pay({
      ...data,
      requester: {
        client_ip: clientIp,
        user_agent: userAgent,
      },
    });

    return {
      hasError: false,
      data: payment,
    };
  }

  @Get('product/:short_id')
  @IsPublic()
  async getProductCheckout(
    @Param('short_id') short_id: string,
    @Query('afid') affiliate_id?: string,
  ) {
    const data = await this.checkoutService.getProductCheckout(
      short_id,
      affiliate_id,
    );

    return {
      hasError: false,
      data: data,
    };
  }

  @Post('metrics/:short_id/meta')
  @IsPublic()
  async sendMetaMetrics(
    @Param('short_id') short_id: string,
    @Body() body: any,
    @Ip() ip: string,
    @Headers('user-agent') user_agent: string,
  ) {
    await this.checkoutService.sendMetricsMeta({
      short_id,
      data: {
        ...body.data,
        user_data: {
          ...body.data.user_data,
          client_ip_address: ip,
          client_user_agent: user_agent,
        },
      },
      test_event_code: body.test_event_code,
    });

    return {
      hasError: false,
      message: 'Evento enviado com sucesso',
    };
  }
}
