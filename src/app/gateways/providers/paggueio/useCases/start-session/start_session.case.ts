import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StartSessionCase {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute() {
    try {
      await this.cacheManager.del('paggueio_session');

      const client_key = this.configService.get<string>('paggueio.client_key');
      const client_secret = this.configService.get<string>(
        'paggueio.client_secret',
      );
      const company_id = this.configService.get<string>('paggueio.company_id');

      const response = await this.httpService.axiosRef.post(
        'https://ms.paggue.io/auth/v1/token',
        {
          client_key,
          client_secret,
        },
      );

      const data = response.data;

      // all pagstar token valid for 5 years
      // but we are going to set it to 6 months
      const expires = 3 * 60 * 60 * 1000; // 3 horas em segundos

      await this.cacheManager.set('paggueio_session', data, expires);

      this.httpService.axiosRef.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.access_token}`;

      this.httpService.axiosRef.defaults.headers.common['X-Company-ID'] =
        company_id;

      return data as {
        access_token: string;
      };
    } catch (error) {
      const msg_error = error?.response?.data?.message || error.message;
      console.error('Error starting paggueio session', msg_error);
      throw new ServerException('Error starting paggueio session');
    }
  }
}
