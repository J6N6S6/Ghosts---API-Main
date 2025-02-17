import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StartPagstarSessionCase {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute() {
    try {
      await this.cacheManager.del('pagstar_session');

      const email = this.configService.get<string>('pagstar.client_email');
      const access_key = this.configService.get<string>('pagstar.access_key');

      const response = await this.httpService.axiosRef.post(
        '/v2/identity/partner/login',
        {
          email,
          access_key,
        },
      );

      const { data } = response.data;

      // all pagstar token valid for 5 years
      // but we are going to set it to 6 months
      const expires = 60 * 60 * 24 * 30 * 6; // 6 months

      await this.cacheManager.set('pagstar_session', data, expires);
      this.httpService.axiosRef.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.access_token}`;

      // set notification url

      const notification_url = this.configService.get<string>(
        'pagstar.callback_url',
      );

      if (notification_url) {
        await this.httpService.axiosRef.patch(
          '/v2/identity/partner/notification-url',
          {
            notification_url,
          },
        );
      }

      return data as {
        access_token: string;
      };
    } catch (error) {
      const msg_error = error?.response?.data?.message || error.message;
      console.error('Error starting pagstar session', msg_error);
      throw new ServerException('Error starting pagstar session');
    }
  }
}
