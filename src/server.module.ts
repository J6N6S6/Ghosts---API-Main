import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import '@sentry/tracing';
import { AppModule } from './app/app.module';
import { ProductsModule } from './app/products/products.module';
import configuration from './config/configuration';
import { SeedModule } from './infra/database/seeding/seed.module';
import { AllExceptionsFilter } from './infra/exception/all-exceptions.filter';
import { InfraModule } from './infra/infra.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        '.env.development',
        '.env.local',
        '.env.production',
        '.env',
      ],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.IS_DEV === 'true') {
          return;
        }
        const redisUrl = configService.get('REDIS_URL');
        if (redisUrl) {
          const redissPattern = /rediss:\/\/([^:]+):([^@]+)@([^:]+):(\d+)/;
          const redisPattern = /redis:\/\/([^:]+):(\d+)/;
          let urlParts;

          if (redisUrl.startsWith('rediss://')) {
            urlParts = redisUrl.match(redissPattern);
            if (urlParts) {
              const [, username, password, host, port] = urlParts;
              return {
                redis: {
                  host,
                  username,
                  port: parseInt(port),
                  password,
                  tls: {}, // Para conexões rediss, use o TLS
                },
                defaultJobOptions: {
                  removeOnComplete: 100,
                  removeOnFail: 1000,
                  attempts: 3,
                  backoff: {
                    type: 'exponential',
                    delay: 1000,
                  },
                },
              };
            }
          } else {
            urlParts = redisUrl.match(redisPattern);
            if (urlParts) {
              const [, host, port] = urlParts;
              return {
                redis: {
                  host,
                  port: parseInt(port),
                },
                defaultJobOptions: {
                  removeOnComplete: 100,
                  removeOnFail: 1000,
                  attempts: 3,
                  backoff: {
                    type: 'exponential',
                    delay: 1000,
                  },
                },
              };
            }
          }
        }
      },
    }),

    InfraModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 30,
    }),
    ScheduleModule.forRoot(),
    AppModule,
    ProductsModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ServerModule {}
