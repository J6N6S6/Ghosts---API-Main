import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import { Agent } from 'https';
import { catchError, firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import { CreatePaymentDTO } from './dtos/CreatePayment.dto';
import { ListPaymentsResponseDTO } from './dtos/ListPaymentsResponse.dto';

@Injectable()
export class InterBankProvider {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL =
      'https://cdpj.partners.bancointer.com.br/';
  }

  async init() {
    const [cert, key] = [
      fs.readFileSync('./API_Certificado.crt'),
      fs.readFileSync('./API_Chave.key'),
    ];

    try {
      this.httpService.axiosRef.defaults.httpsAgent = new Agent({
        cert,
        key,
      });
    } catch (error) {
      console.error('Erro na leitura do certificado ou chave:', error);
    }
  }

  async getToken() {
    const value = await this.cacheManager.get(
      'INTER_PJ_BANKING_PAYMENT_ACCESS_TOKEN',
    );

    if (value != null) {
      return value;
    }

    const client_id = this.configService.get<string>(
      'inter_pj_banking.client_id',
    );
    const client_secret = this.configService.get<string>(
      'inter_pj_banking.client_secret',
    );

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'oauth/v2/token',
          {
            client_id,
            client_secret,
            scope: 'cob.write cob.read',
            grant_type: 'client_credentials',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response?.data);
            throw new HttpException(JSON.stringify(error.response?.data), 500);
          }),
        ),
    );

    await this.cacheManager.set(
      'INTER_PJ_BANKING_PAYMENT_ACCESS_TOKEN',
      data.access_token,
      data.expires_in,
    );

    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.access_token}`;

    return data.access_token;
  }

  async createImmediatePayment({ txid, ...payment }: CreatePaymentDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .put<CreatePaymentDTO>(`pix/v2/cob/${txid}`, payment)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response?.data, error.request);
            throw new HttpException(JSON.stringify(error.response?.data), 500);
          }),
        ),
    );

    return data;
  }

  async updateImmediatePayment({ txid, ...payment }: CreatePaymentDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch<CreatePaymentDTO>(`pix/v2/cob/${txid}`, payment)
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(JSON.stringify(error.response?.data), 500);
          }),
        ),
    );

    return data;
  }

  async getImmediatePayment(txid: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<CreatePaymentDTO>(`pix/v2/cob/${txid}`).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(JSON.stringify(error.response?.data), 500);
        }),
      ),
    );

    return data;
  }

  async findAllImmediatePayment(start: string, end: string, cpf?: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ListPaymentsResponseDTO>('pix/v2/cob', {
          params: {
            inicio: start,
            fim: end,
            cpf,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(JSON.stringify(error.response?.data), 500);
          }),
        ),
    );

    return data;
  }
}
