import { ServerException } from '@/infra/exception/server.exception';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionResponseDTO } from './session_response';

@Injectable()
export class StartCelcoinSessionCase {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute() {
    try {
      await this.cacheManager.del('celcoin_session');

      const galax_id = this.configService.get<string>('celcoin.galax_id');
      const galax_hash = this.configService.get<string>('celcoin.galax_hash');

      const credentials = `${galax_id}:${galax_hash}`;
      const encodedCredentials = Buffer.from(credentials, 'utf-8').toString(
        'base64',
      );

      const requestBody = {
        grant_type: 'authorization_code',
        scope:
          'customers.read customers.write plans.read plans.write transactions.read transactions.write webhooks.write balance.read balance.write cards.read cards.write card-brands.read charges.read charges.write',
      };

      const { data }: { data: SessionResponseDTO } =
        await this.httpService.axiosRef.post('/token', requestBody, {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        });
      this.httpService.axiosRef.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.access_token}`;

      console.log('Celcoin session started: ', data);

      let sessionExpires = 550 * 1000; // 550 segundos
      await this.cacheManager.set('celcoin_session', data, sessionExpires);

      return data;
    } catch (error) {
      console.log('Error starting celcoin ssession: ', error.response.data);
    }
  }
}
