import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import { InterPJIpn } from '@/app/gateways/providers/inter-bank/dtos/InterPJIpn.dto';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IpnService } from '../services/ipn.service';
import { OpenPixIpnDTO } from '../useCases/openpix-ipn/openpix.ipn.dto';
import { PaggueioDTO } from '../useCases/paggueio-ipn/paggueio.ipn.dto';
import { FirebankingDTO } from '../useCases/firebanking-ipn/firebanking.ipn.dto';

@Controller('ipn')
@Throttle(100, 1)
export class IpnController {
  constructor(private readonly ipnService: IpnService) {}

  // @Post('safe2pay')
  // @IsPublic()
  // async safe2payIpn(@Body() data: any) {
  //   return await this.ipnService.safe2payIpn(data);
  // }

  // @Post('interpj')
  // @IsPublic()
  // @HttpCode(201)
  // async interpjIpng(@Body() data: any) {
  //   await Promise.all(
  //     data.pix.map(async (item: InterPJIpn) => {
  //       return await this.ipnService.interpjIpn(item);
  //     }),
  //   );

  //   return { success: true };
  // }

  // @Post('mercadopago')
  // @IsPublic()
  // @HttpCode(201)
  // async MercadoPagoIPN(
  //   @Query() data: { topic: string; id: string; 'data.id': string },
  // ) {
  //   await this.ipnService.mercadopagoIpn({
  //     topic: data.topic,
  //     id: data.id || data['data.id'],
  //   });

  //   return { success: true };
  // }

  @Post('paggueio')
  @IsPublic()
  @HttpCode(200)
  async PaggueioIpn(
    @Body()
    data: PaggueioDTO,
    @Query('ipn_secret') ipn_secret: string,
  ) {
    if (
      ipn_secret !==
      'BbycPX7JT1whaEFVPZc67Qctda5dSCam92peyOQXVUi2ARBWho2UYSifkpCJuHQZ'
    ) {
      return 404;
    }

    await this.ipnService.paggueioIpn({ ...data, ipn_secret });

    return 200;
  }

  @Post('firebank')
  @IsPublic()
  @HttpCode(200)
  async FirebankingIpn(
    @Body()
    data: FirebankingDTO,
  ) {
    await this.ipnService.firebankingIpn(data);

    return 200;
  }

  // @Post('suitpay')
  // @IsPublic()
  // @HttpCode(200)
  // async SuitpayIpn(
  //   // get the ip address of the request
  //   @Request() req,
  //   @Response() res,
  //   @Body()
  //   data: {
  //     idTransaction: string;
  //     statusTransaction: string;
  //     typeTransaction: string;
  //   },
  // ) {
  //   const authorizedIpList = [
  //     '208.68.39.149',
  //     '157.245.93.131',
  //     '162.243.162.250',
  //     '137.184.60.127',
  //     '192.34.62.86',
  //   ];

  //   const host = req.headers['host'];
  //   console.log('host', host);

  //   const serverIp =
  //     req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  //   if (!authorizedIpList.includes(serverIp) && host !== 'api.sunize.com.br') {
  //     console.log(
  //       'Unauthorized IP for suitpay webhook',
  //       req.headers['x-forwarded-for'],
  //       req.connection.remoteAddress,
  //     );

  //     return res.status(401).send({
  //       success: false,
  //       message: 'Unauthorized IP',
  //     });
  //   }

  //   await this.ipnService.suitpayIpn(data);

  //   return res.status(200).send({ success: true });
  // }

  // @Post('pagstar')
  // @IsPublic()
  // @HttpCode(201)
  // async PagstarIpn(
  //   @Body() data: { external_reference: string; transaction_id: string },
  // ) {
  //   await this.ipnService.pagstarIpn({
  //     external_reference: data.external_reference,
  //     transaction_id: data.transaction_id,
  //   });

  //   return { success: true };
  // }

  // @Post('saqpay')
  // @IsPublic()
  // @HttpCode(200)
  // async SaqPayIpn(
  //   @Body()
  //   data: any,
  //   @Headers('Authorization') ipn_secret: string,
  // ) {
  //   await this.ipnService.saqPayIpn({ ...data, ipn_secret });

  //   return 200;
  // }

  // @Post('openpix')
  // @IsPublic()
  // @HttpCode(200)
  // async OpenPixIpn(
  //   @Body()
  //   data: OpenPixIpnDTO,
  //   @Headers('ipn_secret') ipn_secret: string,
  // ) {
  //   await this.ipnService.openPixIpn({ ...data, ipn_secret });

  //   return 200;
  // }

  // @Post('starpay')
  // @IsPublic()
  // @HttpCode(200)
  // async StarpayIpn(
  //   @Query('ipn_secret')
  //   ipn_secret: string,
  //   @Body()
  //   data: {
  //     idTransaction: string;
  //     statusTransaction: string;
  //     typeTransaction: string;
  //     ipn_secret: string;
  //   },
  // ) {
  //   await this.ipnService.starPayIpn({ ...data, ipn_secret });
  //   return 200;
  // }

  // @Post('cielo')
  // @IsPublic()
  // @HttpCode(200)
  // async CieloIpn(
  //   @Body()
  //   data: {
  //     PaymentId: string;
  //   },
  // ) {
  //   await this.ipnService.cieloIpn({ ...data });
  //   return 200;
  // }
}
