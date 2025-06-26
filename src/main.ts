import './infra/apps/datadog/index';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';
import * as moment from 'moment-timezone';

if (!process.env.DEBUG) {
  process.env.DEBUG = 'bull:*';
}

async function bootstrap() {
  const app = await NestFactory.create(ServerModule, {
    cors: {
      origin: process.env.IS_DEV
        ? '*'
        : [
            'https://projectxpayment.com',
            'https://admin.projectxpayment.com',
            'https://painel.projectxpayment.com',
            'https://pag.projectxpayment.com',
            'https://sso.projectxpayment.com',
            'https://sso.projectxpay.com.br',
            'https://pag.projectxpay.com.br',
            'https://painel.projectxpay.com.br',
            'https://admin.projectxpay.com.br',

            'http://localhost:3000',
          ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  moment.tz.setDefault('America/New_York');

  await app.listen(process.env.PORT || 3333).then(() => {
    new ConsoleLogger().log('app started 🔥');
    new ConsoleLogger().log(new Date());
  });
}
bootstrap();
