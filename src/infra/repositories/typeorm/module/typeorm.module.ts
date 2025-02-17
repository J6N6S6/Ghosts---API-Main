import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'true' ? true : false,
        extra: {
          ...(process.env.DATABASE_SSL === 'true'
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {}),
          options: '-c timezone=America/Sao_Paulo',
        },
        autoLoadEntities: true,
        entities: [__dirname + '/../../../database/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class TypeOrmDbModule {}
